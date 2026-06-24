import { Router } from 'express';
import {
  getCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
} from '../controllers/cart.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  addItemSchema,
  updateItemQuantitySchema,
  cartUserParamsSchema,
  removeItemSchema,
} from '../validators/cart.validator';

const router = Router();

router.get('/:userId', validate(cartUserParamsSchema), getCart);
router.post('/:userId/items', validate(addItemSchema), addItem);
router.put('/:userId/items/:productId', validate(updateItemQuantitySchema), updateQuantity);
router.delete('/:userId/items/:productId', validate(removeItemSchema), removeItem);
router.delete('/:userId', validate(cartUserParamsSchema), clearCart);

export default router;
