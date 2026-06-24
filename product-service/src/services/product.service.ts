import { ProductRepository } from '../repositories/product.repository';
import { IProduct } from '../models/product.model';
import { AppError } from '../utils/AppError';

export class ProductService {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  async createProduct(data: Partial<IProduct>): Promise<IProduct> {
    if (data.sku) {
      const existing = await this.repository.findBySku(data.sku);
      if (existing) {
        throw new AppError('Product with this SKU already exists', 409);
      }
    }
    return this.repository.create(data);
  }

  async getProductById(id: string): Promise<IProduct> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  async getProducts(
    page: number = 1,
    limit: number = 10,
    category?: string,
    search?: string
  ) {
    const filter: Record<string, any> = {};
    if (category) {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const { data, total } = await this.repository.findAll(filter, page, limit);
    return {
      products: data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateProduct(id: string, data: Partial<IProduct>): Promise<IProduct> {
    if (data.sku) {
      const existing = await this.repository.findBySku(data.sku);
      if (existing && existing._id.toString() !== id) {
        throw new AppError('Product with this SKU already exists', 409);
      }
    }

    const product = await this.repository.update(id, data);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.repository.softDelete(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
  }
}
