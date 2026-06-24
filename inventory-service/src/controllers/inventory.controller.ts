import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory.service';
import { ApiResponse } from '../utils/ApiResponse';

const inventoryService = new InventoryService();

export const getStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stock = await inventoryService.getStock(req.params.productId as string);
    return res.status(200).json(new ApiResponse('Stock fetched successfully', stock));
  } catch (error) {
    next(error);
  }
};

export const addStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, quantity } = req.body;
    const stock = await inventoryService.addStock(productId, quantity);
    return res.status(200).json(new ApiResponse('Stock added successfully', stock));
  } catch (error) {
    next(error);
  }
};

export const deductStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items } = req.body;
    await inventoryService.deductBulkStock(items);
    return res.status(200).json(new ApiResponse('Stock deducted successfully'));
  } catch (error) {
    next(error);
  }
};
