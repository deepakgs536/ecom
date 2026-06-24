import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/cart-test-db');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Cart API', () => {
  const userId = 'user_12345';
  const productId = new mongoose.Types.ObjectId().toHexString();

  it('should get an empty cart for a new user', async () => {
    const res = await request(app).get(`/cart/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items.length).toBe(0);
    expect(res.body.data.totalPrice).toBe(0);
  });

  it('should add an item to the cart', async () => {
    const res = await request(app).post(`/cart/${userId}/items`).send({
      productId,
      quantity: 2,
      price: 50.0,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items.length).toBe(1);
    expect(res.body.data.totalPrice).toBe(100.0);
  });

  it('should increment quantity if item already exists', async () => {
    const res = await request(app).post(`/cart/${userId}/items`).send({
      productId,
      quantity: 3,
      price: 50.0,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items[0].quantity).toBe(5);
    expect(res.body.data.totalPrice).toBe(250.0);
  });

  it('should update an item quantity directly', async () => {
    const res = await request(app).put(`/cart/${userId}/items/${productId}`).send({
      quantity: 1,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items[0].quantity).toBe(1);
    expect(res.body.data.totalPrice).toBe(50.0);
  });

  it('should fail to update item quantity if product not in cart', async () => {
    const fakeId = new mongoose.Types.ObjectId().toHexString();
    const res = await request(app).put(`/cart/${userId}/items/${fakeId}`).send({
      quantity: 1,
    });

    expect(res.status).toBe(404);
  });

  it('should remove an item from the cart', async () => {
    const res = await request(app).delete(`/cart/${userId}/items/${productId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBe(0);
    expect(res.body.data.totalPrice).toBe(0);
  });

  it('should clear the entire cart', async () => {
    await request(app).post(`/cart/${userId}/items`).send({
      productId,
      quantity: 1,
      price: 10,
    });

    const clearRes = await request(app).delete(`/cart/${userId}`);
    expect(clearRes.status).toBe(200);

    const getRes = await request(app).get(`/cart/${userId}`);
    expect(getRes.body.data.items.length).toBe(0);
  });
});
