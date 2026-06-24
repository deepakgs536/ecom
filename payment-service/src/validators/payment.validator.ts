import { z } from 'zod';

export const processPaymentSchema = z.object({
  body: z.object({
    orderId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Order ID'),
    userId: z.string().min(1, 'User ID is required'),
    amount: z.number().positive('Amount must be greater than 0'),
    currency: z.string().length(3).optional(),
  }),
});

export const getOrderPaymentsParamsSchema = z.object({
  params: z.object({
    orderId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Order ID'),
  }),
});
