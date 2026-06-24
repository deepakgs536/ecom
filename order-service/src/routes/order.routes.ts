import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
} from '../controllers/order.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createOrderSchema,
  getOrderParamsSchema,
  getUserOrdersParamsSchema,
  updateOrderStatusSchema,
} from '../validators/order.validator';

const router = Router();

router.post('/', validate(createOrderSchema), createOrder);
router.get('/user/:userId', validate(getUserOrdersParamsSchema), getUserOrders);
router.get('/:orderId', validate(getOrderParamsSchema), getOrderById);
router.put('/:orderId/status', validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
