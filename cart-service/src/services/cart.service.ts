import { CartRepository } from '../repositories/cart.repository';
import { ICart, ICartItem } from '../models/cart.model';
import { AppError } from '../utils/AppError';

export class CartService {
  private repository: CartRepository;

  constructor() {
    this.repository = new CartRepository();
  }

  private calculateTotal(cart: ICart): number {
    return cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
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
