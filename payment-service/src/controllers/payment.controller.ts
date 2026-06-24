import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';
import { ApiResponse } from '../utils/ApiResponse';

const paymentService = new PaymentService();

export const processPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId, userId, amount, currency } = req.body;
    const payment = await paymentService.processPayment(orderId, userId, amount, currency);
    
    return res.status(200).json(new ApiResponse('Payment processed', payment));
  } catch (error) {
    next(error);
  }
};

export const getOrderPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payments = await paymentService.getPaymentsByOrderId(req.params.orderId as string);
    return res.status(200).json(new ApiResponse('Payments fetched successfully', payments));
  } catch (error) {
    next(error);
  }
};
