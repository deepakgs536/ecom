import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/inventory-test-db');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Inventory API', () => {
  const productId = new mongoose.Types.ObjectId().toHexString();
  const productId2 = new mongoose.Types.ObjectId().toHexString();

  it('should lazily initialize stock to 0 for new product', async () => {
    const res = await request(app).get(`/inventory/${productId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.productId).toBe(productId);
    expect(res.body.data.stockQuantity).toBe(0);
  });

  it('should add stock to a product', async () => {
    const res = await request(app).post('/inventory/restock').send({
      productId,
      quantity: 10,
    });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.stockQuantity).toBe(10);
  });

  it('should fail to deduct stock if insufficient', async () => {
    const res = await request(app).post('/inventory/deduct').send({
      items: [
        { productId, quantity: 15 }
      ]
    });
    
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should successfully bulk deduct stock', async () => {
    await request(app).post('/inventory/restock').send({
      productId: productId2,
      quantity: 5,
    });

    const res = await request(app).post('/inventory/deduct').send({
      items: [
        { productId, quantity: 2 },
        { productId: productId2, quantity: 3 }
      ]
    });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const check1 = await request(app).get(`/inventory/${productId}`);
    expect(check1.body.data.stockQuantity).toBe(8);

    const check2 = await request(app).get(`/inventory/${productId2}`);
    expect(check2.body.data.stockQuantity).toBe(2);
  });
  
  it('should rollback successful deductions if a later one fails', async () => {
      const res = await request(app).post('/inventory/deduct').send({
        items: [
          { productId, quantity: 2 },
          { productId: productId2, quantity: 10 }
        ]
      });
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
  
      const check1 = await request(app).get(`/inventory/${productId}`);
      expect(check1.body.data.stockQuantity).toBe(8);
  });
});
