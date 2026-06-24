import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { ApiResponse } from '../utils/ApiResponse';

const orderService = new OrderService();

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, shippingAddress } = req.body;
    const order = await orderService.createOrder(userId, shippingAddress);
    return res.status(201).json(new ApiResponse('Order created successfully', order));
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.getOrderById(req.params.orderId as string);
    return res.status(200).json(new ApiResponse('Order fetched successfully', order));
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.getUserOrders(req.params.userId as string);
    return res.status(200).json(new ApiResponse('User orders fetched successfully', orders));
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.orderId as string,
      req.body.status,
      req.body.paymentStatus
    );
    return res.status(200).json(new ApiResponse('Order status updated successfully', order));
  } catch (error) {
    next(error);
  }
};
