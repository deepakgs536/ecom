import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface ICart extends Document {
  userId: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const CartSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    items: [CartItemSchema],
  },
  {
    timestamps: true,
  }
);

export const Cart = mongoose.model<ICart>('Cart', CartSchema);
