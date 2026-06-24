import { Router } from 'express';
import { processPayment, getOrderPayments } from '../controllers/payment.controller';
import { validate } from '../middlewares/validate.middleware';
import { processPaymentSchema, getOrderPaymentsParamsSchema } from '../validators/payment.validator';

const router = Router();

router.post('/process', validate(processPaymentSchema), processPayment);
router.get('/order/:orderId', validate(getOrderPaymentsParamsSchema), getOrderPayments);

export default router;
