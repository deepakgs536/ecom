import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface IShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface IOrder extends Document {
  userId: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    items: [OrderItemSchema],
    shippingAddress: { type: ShippingAddressSchema, required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
