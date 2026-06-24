import { z } from 'zod';

export const addItemSchema = z.object({
  params: z.object({
    userId: z.string().min(1, 'User ID is required'),
  }),
  body: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID'),
    quantity: z.number().int().positive('Quantity must be at least 1'),
    price: z.number().nonnegative('Price cannot be negative'),
  }),
});

export const updateItemQuantitySchema = z.object({
  params: z.object({
    userId: z.string().min(1, 'User ID is required'),
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID'),
  }),
  body: z.object({
    quantity: z.number().int().positive('Quantity must be at least 1'),
  }),
});

export const cartUserParamsSchema = z.object({
  params: z.object({
    userId: z.string().min(1, 'User ID is required'),
  }),
});

export const removeItemSchema = z.object({
  params: z.object({
    userId: z.string().min(1, 'User ID is required'),
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID'),
  }),
});
