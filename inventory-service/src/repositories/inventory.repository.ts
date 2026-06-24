import { Inventory, IInventory } from '../models/inventory.model';

export class InventoryRepository {
  async findByProductId(productId: string): Promise<IInventory | null> {
    return Inventory.findOne({ productId }).exec();
  }

  async createOrUpdateStock(productId: string, quantityToAdd: number): Promise<IInventory> {
    return Inventory.findOneAndUpdate(
      { productId },
      { $inc: { stockQuantity: quantityToAdd } },
      { new: true, upsert: true }
    ).exec();
  }

  async deductStockAtomic(productId: string, quantityToDeduct: number): Promise<IInventory | null> {
    return Inventory.findOneAndUpdate(
      { 
        productId, 
        stockQuantity: { $gte: quantityToDeduct } 
      },
      { 
        $inc: { stockQuantity: -quantityToDeduct } 
      },
      { new: true }
    ).exec();
  }
}
