import { Cart, ICart, ICartItem } from '../models/cart.model';

export class CartRepository {
  async findByUserId(userId: string): Promise<ICart | null> {
    return Cart.findOne({ userId }).exec();
  }

  async createCart(userId: string, items: ICartItem[] = []): Promise<ICart> {
    const cart = new Cart({ userId, items });
    return cart.save();
  }

  async saveCart(cart: ICart): Promise<ICart> {
    return cart.save();
  }

  async deleteCart(userId: string): Promise<void> {
    await Cart.findOneAndDelete({ userId }).exec();
  }
}
