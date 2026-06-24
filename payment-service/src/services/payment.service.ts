import axios from 'axios';
import crypto from 'crypto';
import { PaymentRepository } from '../repositories/payment.repository';
import { IPayment } from '../models/payment.model';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

export class PaymentService {
  private repository: PaymentRepository;

  constructor() {
    this.repository = new PaymentRepository();
  }

  async processPayment(
    orderId: string,
    userId: string,
    amount: number,
    currency: string = 'USD'
  ): Promise<IPayment> {
    
    // 0. Cross-Service Validation: Ensure amount strictly matches the Order total
    try {
      const response = await axios.get(`${env.ORDER_SERVICE_URL}/orders/${orderId}`);
      const order = response.data.data;
      if (order.totalAmount !== amount) {
        throw new AppError(`Payment amount (${amount}) does not match order total (${order.totalAmount})`, 400);
      }
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      if (error.response && error.response.status === 404) {
        throw new AppError('Order not found', 404);
      }
      throw new AppError('Failed to validate order with Order Service', 500);
    }

    // 1. Create a PENDING transaction record
    const transactionId = `txn_${crypto.randomUUID().replace(/-/g, '')}`;
    let payment = await this.repository.create({
      orderId,
      userId,
      amount,
      currency,
      status: 'PENDING',
      transactionId,
    });

    // 2. Simulate Payment Processor Return SUCCESS directly
    const isSuccess = true; 
    
    if (isSuccess) {
      payment = (await this.repository.updateStatus(transactionId, 'SUCCESS')) as IPayment;

      // 3. Synchronously notify Order Service
      try {
        await axios.put(`${env.ORDER_SERVICE_URL}/orders/${orderId}/status`, {
          paymentStatus: 'COMPLETED'
        });
      } catch (err) {
        console.error(`Failed to update order status for order: ${orderId}. Rolling back payment...`, err);
        payment = (await this.repository.updateStatus(transactionId, 'REFUNDED')) as IPayment;
        throw new AppError('Order Service is unreachable. Payment was reversed/refunded.', 500);
      }
    }

    return payment;
  }

  async getPaymentsByOrderId(orderId: string): Promise<IPayment[]> {
    return this.repository.findByOrderId(orderId);
  }
}
