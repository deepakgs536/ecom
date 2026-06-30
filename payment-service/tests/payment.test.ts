import request from 'supertest';
import mongoose from 'mongoose';
import axios from 'axios';
import app from '../src/app';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/payment-test-db');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Payment API', () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const userId = 'user_123';

  it('should process a successful payment and notify order-service', async () => {
    // Mock the order lookup to validate amount
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: { totalAmount: 150.00 } }
    });

    // Mock the order status update webhook
    mockedAxios.put.mockResolvedValueOnce({ data: { success: true } });

    const res = await request(app).post('/payments/process').send({
      orderId,
      userId,
      amount: 150.00,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('SUCCESS');
    expect(res.body.data.transactionId).toBeDefined();

    expect(mockedAxios.put).toHaveBeenCalledWith(
      expect.stringContaining(`/orders/${orderId}/status`),
      { paymentStatus: 'COMPLETED' }
    );
  });

  it('should fail if payment amount does not match order total', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: { totalAmount: 500.00 } }
    });

    const res = await request(app).post('/payments/process').send({
      orderId,
      userId,
      amount: 150.00,
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should refund payment if order service webhook fails', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: { totalAmount: 150.00 } }
    });

    mockedAxios.put.mockRejectedValueOnce(new Error('Network timeout'));

    const res = await request(app).post('/payments/process').send({
      orderId,
      userId,
      amount: 150.00,
    });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);

    // Verify it was marked as REFUNDED
    const getRes = await request(app).get(`/payments/order/${orderId}`);
    // Grab the most recent payment attempt
    const refundedPayment = getRes.body.data.find((p: any) => p.status === 'REFUNDED');
    expect(refundedPayment).toBeDefined();
  });

  it('should fetch payment history for an order', async () => {
    const res = await request(app).get(`/payments/order/${orderId}`);
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].orderId).toBe(orderId);
  });
});
