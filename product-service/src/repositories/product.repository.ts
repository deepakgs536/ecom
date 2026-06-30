import { Product, IProduct } from '../models/product.model';

export class ProductRepository {
  async create(data: Partial<IProduct>): Promise<IProduct> {
    const product = new Product(data);
    return product.save();
  }

  async findById(id: string): Promise<IProduct | null> {
    return Product.findOne({ _id: id, isDeleted: { $ne: true } }).exec();
  }

  async findBySku(sku: string): Promise<IProduct | null> {
    return Product.findOne({ sku, isDeleted: { $ne: true } }).exec();
  }

  async findAll(
    filter: Record<string, any>,
    page: number,
    limit: number
  ): Promise<{ data: IProduct[]; total: number }> {
    const skip = (page - 1) * limit;
    
    // Ensure we do not fetch soft-deleted products
    const activeFilter = { ...filter, isDeleted: { $ne: true } };
    
    const [data, total] = await Promise.all([
      Product.find(activeFilter).skip(skip).limit(limit).exec(),
      Product.countDocuments(activeFilter).exec(),
    ]);

    return { data, total };
  }

  async update(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
    return Product.findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, data, { new: true, runValidators: true }).exec();
  }

  async softDelete(id: string): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).exec();
  }
}
