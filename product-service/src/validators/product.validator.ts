import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    sku: z.string().min(3, 'SKU must be at least 3 characters'),
    price: z.number().positive('Price must be greater than 0'),
    currency: z.string().length(3).optional().default('USD'),
    category: z.string().min(2, 'Category must be at least 2 characters'),
    images: z.array(z.string().url()).optional().default([]),
    isActive: z.boolean().optional().default(true),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    sku: z.string().min(3).optional(),
    price: z.number().positive().optional(),
    currency: z.string().length(3).optional(),
    category: z.string().min(2).optional(),
    images: z.array(z.string().url()).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const getProductSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID'),
  }),
});

export const deleteProductSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID'),
  }),
});

export const listProductsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default(10),
    category: z.string().optional(),
    search: z.string().optional(),
  }),
});
