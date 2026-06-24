import mongoose, { Document, Schema } from 'mongoose';

export interface IInventory extends Document {
  productId: string;
  stockQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const InventorySchema = new Schema(
  {
    productId: { type: String, required: true, unique: true, index: true },
    stockQuantity: { type: Number, required: true, min: 0, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Inventory = mongoose.model<IInventory>('Inventory', InventorySchema);
