import { z } from 'zod';

export const getInventorySchema = z.object({
  params: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID'),
  }),
});

export const addStockSchema = z.object({
  body: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID'),
    quantity: z.number().int().positive('Quantity to add must be > 0'),
  }),
});

export const deductStockSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID'),
        quantity: z.number().int().positive('Quantity to deduct must be > 0'),
      })
    ).min(1, 'At least one item must be provided'),
  }),
});
