import axios from 'axios';
import crypto from 'crypto';
import { PaymentRepository } from '../repositories/payment.repository';
import { IPayment } from '../models/payment.model';
import { env } from '../config/env';

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
        console.error(`Failed to update order status for order: ${orderId}`, err);
      }
    }

    return payment;
  }

  async getPaymentsByOrderId(orderId: string): Promise<IPayment[]> {
    return this.repository.findByOrderId(orderId);
  }
}
