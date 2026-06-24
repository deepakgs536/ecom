import request from 'supertest';
import mongoose from 'mongoose';
import axios from 'axios';
import app from '../src/app';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/order-test-db');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Order API', () => {
  const userId = 'user_999';
  let orderId: string;

  it('should create a new order by fetching cart via axios', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: {
          items: [
            { productId: 'prod1', quantity: 2, price: 50 },
            { productId: 'prod2', quantity: 1, price: 100 }
          ]
        }
      }
    });

    mockedAxios.delete.mockResolvedValueOnce({});

    const res = await request(app).post('/orders').send({
      userId,
      shippingAddress: {
        street: '123 Main St',
        city: 'Metropolis',
        state: 'NY',
        zip: '10001',
        country: 'USA'
      }
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalAmount).toBe(200);
    expect(res.body.data.status).toBe('PENDING');
    orderId = res.body.data._id;
  });

  it('should fail to create order if cart is empty', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: { items: [] } }
    });

    const res = await request(app).post('/orders').send({
      userId,
      shippingAddress: {
        street: '123 Main St',
        city: 'Metropolis',
        state: 'NY',
        zip: '10001',
        country: 'USA'
      }
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should fetch user orders', async () => {
    const res = await request(app).get(`/orders/user/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0]._id).toBe(orderId);
  });

  it('should get specific order details', async () => {
    const res = await request(app).get(`/orders/${orderId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(orderId);
  });

  it('should update order status', async () => {
    const res = await request(app).put(`/orders/${orderId}/status`).send({
      status: 'SHIPPED',
      paymentStatus: 'COMPLETED'
    });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('SHIPPED');
    expect(res.body.data.paymentStatus).toBe('COMPLETED');
  });
});
