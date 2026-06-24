import { InventoryRepository } from '../repositories/inventory.repository';
import { IInventory } from '../models/inventory.model';
import { AppError } from '../utils/AppError';

export class InventoryService {
  private repository: InventoryRepository;

  constructor() {
    this.repository = new InventoryRepository();
  }

  async getStock(productId: string): Promise<IInventory> {
    let inventory = await this.repository.findByProductId(productId);
    if (!inventory) {
      inventory = await this.repository.createOrUpdateStock(productId, 0);
    }
    return inventory;
  }

  async addStock(productId: string, quantity: number): Promise<IInventory> {
    return this.repository.createOrUpdateStock(productId, quantity);
  }

  async deductBulkStock(items: { productId: string; quantity: number }[]): Promise<void> {
    for (const item of items) {
      const inventory = await this.getStock(item.productId);
      if (inventory.stockQuantity < item.quantity) {
        throw new AppError(`Insufficient stock for product ${item.productId}. Available: ${inventory.stockQuantity}, Required: ${item.quantity}`, 400);
      }
    }

    const deductedProducts = [];
    
    try {
      for (const item of items) {
        const updated = await this.repository.deductStockAtomic(item.productId, item.quantity);
        if (!updated) {
           throw new Error(`Concurrency conflict or insufficient stock for ${item.productId} during atomic deduction.`);
        }
        deductedProducts.push(item);
      }
    } catch (error: any) {
      for (const rollbackItem of deductedProducts) {
        await this.repository.createOrUpdateStock(rollbackItem.productId, rollbackItem.quantity);
      }
      throw new AppError('Bulk deduction failed. Rolled back.', 400);
    }
  }
}
