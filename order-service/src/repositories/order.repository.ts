import { Order, IOrder } from '../models/order.model';

export class OrderRepository {
  async create(data: Partial<IOrder>): Promise<IOrder> {
    const order = new Order(data);
    return order.save();
  }

  async findByUserId(userId: string): Promise<IOrder[]> {
    return Order.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findById(orderId: string): Promise<IOrder | null> {
    return Order.findById(orderId).exec();
  }

  async updateStatus(
    orderId: string,
    status?: string,
    paymentStatus?: string
  ): Promise<IOrder | null> {
    const updatePayload: Record<string, string> = {};
    if (status) updatePayload.status = status;
    if (paymentStatus) updatePayload.paymentStatus = paymentStatus;

    return Order.findByIdAndUpdate(orderId, updatePayload, { new: true, runValidators: true }).exec();
  }

  async deleteOrder(orderId: string): Promise<void> {
    await Order.findByIdAndDelete(orderId).exec();
  }
}
