import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  deleteProductSchema,
  listProductsSchema,
} from '../validators/product.validator';

const router = Router();

router.post('/', validate(createProductSchema), createProduct);
router.get('/', validate(listProductsSchema), getProducts);
router.get('/:id', validate(getProductSchema), getProductById);
router.put('/:id', validate(updateProductSchema), updateProduct);
router.delete('/:id', validate(deleteProductSchema), deleteProduct);

export default router;
