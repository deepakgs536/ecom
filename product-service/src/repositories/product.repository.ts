import { Product, IProduct } from '../models/product.model';

export class ProductRepository {
  async create(data: Partial<IProduct>): Promise<IProduct> {
    const product = new Product(data);
    return product.save();
  }

  async findById(id: string): Promise<IProduct | null> {
    return Product.findById(id).exec();
  }

  async findBySku(sku: string): Promise<IProduct | null> {
    return Product.findOne({ sku }).exec();
  }

  async findAll(
    filter: Record<string, any>,
    page: number,
    limit: number
  ): Promise<{ data: IProduct[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(limit).exec(),
      Product.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }

  async update(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  async softDelete(id: string): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).exec();
  }
}
