import { Request, Response, NextFunction } from 'express';
import { CartService } from '../services/cart.service';
import { ApiResponse } from '../utils/ApiResponse';

const cartService = new CartService();

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await cartService.getCart(req.params.userId as string);
    return res.status(200).json(new ApiResponse('Cart fetched successfully', cart));
  } catch (error) {
    next(error);
  }
};

export const addItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await cartService.addItemToCart(req.params.userId as string, req.body);
    return res.status(200).json(new ApiResponse('Item added to cart', cart));
  } catch (error) {
    next(error);
  }
};

export const updateQuantity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await cartService.updateItemQuantity(
      req.params.userId as string,
      req.params.productId as string,
      req.body.quantity
    );
    return res.status(200).json(new ApiResponse('Cart item quantity updated', cart));
  } catch (error) {
    next(error);
  }
};

export const removeItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await cartService.removeItemFromCart(
      req.params.userId as string,
      req.params.productId as string
    );
    return res.status(200).json(new ApiResponse('Item removed from cart', cart));
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await cartService.clearCart(req.params.userId as string);
    return res.status(200).json(new ApiResponse('Cart cleared successfully'));
  } catch (error) {
    next(error);
  }
};
