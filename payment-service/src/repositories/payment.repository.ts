import { Payment, IPayment } from '../models/payment.model';

export class PaymentRepository {
  async create(data: Partial<IPayment>): Promise<IPayment> {
    const payment = new Payment(data);
    return payment.save();
  }

  async findByOrderId(orderId: string): Promise<IPayment[]> {
    return Payment.find({ orderId }).sort({ createdAt: -1 }).exec();
  }

  async updateStatus(transactionId: string, status: string): Promise<IPayment | null> {
    return Payment.findOneAndUpdate(
      { transactionId },
      { status },
      { new: true }
    ).exec();
  }
}
