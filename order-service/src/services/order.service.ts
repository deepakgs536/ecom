import axios from 'axios';
import { OrderRepository } from '../repositories/order.repository';
import { IOrder, IShippingAddress, IOrderItem } from '../models/order.model';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

export class OrderService {
  private repository: OrderRepository;

  constructor() {
    this.repository = new OrderRepository();
  }

  async createOrder(userId: string, shippingAddress: IShippingAddress): Promise<IOrder> {
    let cartData;
    try {
      const response = await axios.get(`${env.CART_SERVICE_URL}/cart/${userId}`);
      cartData = response.data.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        throw new AppError('Cart not found', 404);
      }
      throw new AppError('Failed to fetch cart data', 500);
    }

    if (!cartData || !cartData.items || cartData.items.length === 0) {
      throw new AppError('Cannot create an order with an empty cart', 400);
    }

    const items: IOrderItem[] = cartData.items.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    const rawTotal = items.reduce((total, item) => total + item.quantity * item.price, 0);
    const totalAmount = Math.round(rawTotal * 100) / 100;

    const orderPayload = {
      userId,
      items,
      shippingAddress,
      totalAmount,
    };

    const newOrder = await this.repository.create(orderPayload);

    // Distributed Transaction Idempotency: Rollback if cart clear fails
    try {
      await axios.delete(`${env.CART_SERVICE_URL}/cart/${userId}`);
    } catch (err) {
      console.error('Failed to clear cart after order creation, rolling back order...', err);
      await this.repository.deleteOrder(newOrder._id.toString());
      throw new AppError('Failed to clear cart. Order creation was rolled back to prevent duplicate checkout.', 500);
    }

    return newOrder;
  }

  async getOrderById(orderId: string): Promise<IOrder> {
    const order = await this.repository.findById(orderId);
    if (!order) {
      throw new AppError('Order not found', 404);
    }
    return order;
  }

  async getUserOrders(userId: string): Promise<IOrder[]> {
    return this.repository.findByUserId(userId);
  }

  async updateOrderStatus(orderId: string, status?: string, paymentStatus?: string): Promise<IOrder> {
    const order = await this.repository.updateStatus(orderId, status, paymentStatus);
    if (!order) {
      throw new AppError('Order not found', 404);
    }
    return order;
  }
}
