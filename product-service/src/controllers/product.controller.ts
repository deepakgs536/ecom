import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { ApiResponse } from '../utils/ApiResponse';

const productService = new ProductService();

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.createProduct(req.body);
    return res.status(201).json(new ApiResponse('Product created successfully', product));
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;

    const result = await productService.getProducts(page, limit, category, search);
    return res.status(200).json(new ApiResponse('Products fetched successfully', result));
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getProductById(req.params.id as string);
    return res.status(200).json(new ApiResponse('Product fetched successfully', product));
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.updateProduct(req.params.id as string, req.body);
    return res.status(200).json(new ApiResponse('Product updated successfully', product));
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await productService.deleteProduct(req.params.id as string);
    return res.status(200).json(new ApiResponse('Product deleted successfully'));
  } catch (error) {
    next(error);
  }
};
