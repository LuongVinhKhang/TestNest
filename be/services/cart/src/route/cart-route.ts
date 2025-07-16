import express, { Router } from 'express';
// import { authenticateUser } from '../../../shared-middleware/authenticate-user.middleware';
import { cartSchemaValidation } from '../validation/cart-validation';
import CartController from '../controller/cart-controller';

const router: Router = express.Router();

router.get('/', CartController.getCart.bind(CartController));

router.post(
  '/',
  cartSchemaValidation,
  CartController.createCart.bind(CartController),
);

router.put(
  '/',
  cartSchemaValidation,
  CartController.updateCart.bind(CartController),
);

router.delete('/', CartController.deleteCart.bind(CartController));

export default router;
