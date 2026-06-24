import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  sku: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    sku: { type: String, required: true, unique: true, index: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    category: { type: String, required: true, index: true },
    images: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

ProductSchema.pre(/^find/, function (this: any) {
  this.find({ isDeleted: { $ne: true } });
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
