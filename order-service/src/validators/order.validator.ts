import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    userId: z.string().min(1, 'User ID is required'),
    shippingAddress: z.object({
      street: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(1),
      zip: z.string().min(1),
      country: z.string().min(1),
    }),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    orderId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Order ID'),
  }),
  body: z.object({
    status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
    paymentStatus: z.enum(['PENDING', 'COMPLETED', 'FAILED']).optional(),
  }).refine((data) => data.status || data.paymentStatus, {
    message: "At least one of 'status' or 'paymentStatus' must be provided",
  }),
});

export const getOrderParamsSchema = z.object({
  params: z.object({
    orderId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Order ID'),
  }),
});

export const getUserOrdersParamsSchema = z.object({
  params: z.object({
    userId: z.string().min(1, 'User ID is required'),
  }),
});
