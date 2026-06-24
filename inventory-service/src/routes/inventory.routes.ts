import { Router } from 'express';
import { getStock, addStock, deductStock } from '../controllers/inventory.controller';
import { validate } from '../middlewares/validate.middleware';
import { getInventorySchema, addStockSchema, deductStockSchema } from '../validators/inventory.validator';

const router = Router();

router.get('/:productId', validate(getInventorySchema), getStock);
router.post('/restock', validate(addStockSchema), addStock);
router.post('/deduct', validate(deductStockSchema), deductStock);

export default router;
