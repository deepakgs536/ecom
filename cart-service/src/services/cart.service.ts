import { CartRepository } from '../repositories/cart.repository';
import { ICart, ICartItem } from '../models/cart.model';
import { AppError } from '../utils/AppError';
import axios from 'axios';
import { env } from '../config/env';

export class CartService {
  private repository: CartRepository;

  constructor() {
    this.repository = new CartRepository();
  }

  private calculateTotal(cart: ICart): number {
    const total = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    return Math.round(total * 100) / 100;
  }

  private formatCartResponse(cart: ICart) {
    return {
      userId: cart.userId,
      items: cart.items,
      totalPrice: this.calculateTotal(cart),
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }

  async getCart(userId: string) {
    let cart = await this.repository.findByUserId(userId);
    if (!cart) {
      cart = await this.repository.createCart(userId);
    }
    return this.formatCartResponse(cart);
  }

  async addItemToCart(userId: string, itemData: ICartItem) {
    // Cross-Service Validation: Ensure product exists and price is accurate
    try {
      const response = await axios.get(`${env.PRODUCT_SERVICE_URL}/products/${itemData.productId}`);
      const product = response.data.data;
      // Override any client-provided price with the trusted source of truth
      itemData.price = product.price;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        throw new AppError('Product not found in catalog', 404);
      }
      throw new AppError('Failed to validate product with Product Service', 500);
    }

    let cart = await this.repository.findByUserId(userId);
    if (!cart) {
      cart = await this.repository.createCart(userId, [itemData]);
      return this.formatCartResponse(cart);
    }

    const existingItemIndex = cart.items.findIndex((item) => item.productId === itemData.productId);
    
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += itemData.quantity;
    } else {
      cart.items.push(itemData);
    }

    await this.repository.saveCart(cart);
    return this.formatCartResponse(cart);
  }

  async updateItemQuantity(userId: string, productId: string, quantity: number) {
    const cart = await this.repository.findByUserId(userId);
    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    const existingItemIndex = cart.items.findIndex((item) => item.productId === productId);
    if (existingItemIndex === -1) {
      throw new AppError('Item not found in cart', 404);
    }

    cart.items[existingItemIndex].quantity = quantity;
    await this.repository.saveCart(cart);
    return this.formatCartResponse(cart);
  }

  async removeItemFromCart(userId: string, productId: string) {
    const cart = await this.repository.findByUserId(userId);
    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    cart.items = cart.items.filter((item) => item.productId !== productId);
    await this.repository.saveCart(cart);
    return this.formatCartResponse(cart);
  }

  async clearCart(userId: string) {
    await this.repository.deleteCart(userId);
  }
}
