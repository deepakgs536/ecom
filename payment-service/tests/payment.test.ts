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

  it('should fetch payment history for an order', async () => {
    const res = await request(app).get(`/payments/order/${orderId}`);
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].orderId).toBe(orderId);
  });
});
