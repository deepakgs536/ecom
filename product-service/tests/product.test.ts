import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/product-test-db');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Product API', () => {
  let productId: string;

  it('should create a new product', async () => {
    const res = await request(app).post('/products').send({
      name: 'Test Product',
      description: 'A great test product description here',
      sku: 'TEST-SKU-001',
      price: 99.99,
      category: 'Electronics',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Test Product');
    expect(res.body.data.sku).toBe('TEST-SKU-001');
    productId = res.body.data._id;
  });

  it('should fail to create product with existing sku', async () => {
    const res = await request(app).post('/products').send({
      name: 'Another Product',
      description: 'A great test product description here 2',
      sku: 'TEST-SKU-001',
      price: 50.0,
      category: 'Electronics',
    });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should list products with pagination', async () => {
    const res = await request(app).get('/products?page=1&limit=5');
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.products.length).toBeGreaterThan(0);
    expect(res.body.data.pagination.page).toBe(1);
    expect(res.body.data.pagination.limit).toBe(5);
  });

  it('should get a product by id', async () => {
    const res = await request(app).get(`/products/${productId}`);
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(productId);
  });

  it('should update a product', async () => {
    const res = await request(app).put(`/products/${productId}`).send({
      price: 89.99,
    });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.price).toBe(89.99);
  });

  it('should delete a product (soft delete)', async () => {
    const res = await request(app).delete(`/products/${productId}`);
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify it is not in find results anymore
    const getRes = await request(app).get(`/products/${productId}`);
    expect(getRes.status).toBe(404);
  });
});
