import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import CartService from '@cartComponent/services/cart-service';

class CartController {
  /**
   * Get the cart for the authenticated user.
   */
  async getCart(req: Request, res: Response): Promise<void> {
    // @ts-expect-error: req.user is populated by Auth0 middleware and contains sub (user id)
    const userId = req.user?.sub; // Auth0 user ID (string)
    console.log('Auth0 sub:', userId);
    const cart = await CartService.getCartByUserId(userId);
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    res.status(200).json(cart);
  }

  /**
   * Create a new cart for the authenticated user.
   */
  async createCart(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    // @ts-expect-error: req.user is populated by Auth0 middleware and contains sub (user id)
    const userId = req.user?.sub; // Auth0 user ID (string)
    console.log('Auth0 sub:', userId);
    const { items } = req.body;

    const existingCart = await CartService.getCartByUserId(userId);
    if (existingCart) {
      res.status(400).json({ message: 'Cart already exists' });
      return;
    }

    const cart = await CartService.createCart(userId, items);
    res.status(201).json(cart);
  }

  /**
   * Update the cart for the authenticated user.
   */
  async updateCart(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    // @ts-expect-error: req.user is populated by Auth0 middleware and contains sub (user id)
    const userId = req.user?.sub; // Auth0 user ID (string)
    console.log('Auth0 sub:', userId);
    const { items } = req.body;

    const updatedCart = await CartService.updateCart(userId, items);
    if (!updatedCart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    res.status(200).json(updatedCart);
  }

  /**
   * Delete the cart for the authenticated user.
   */
  async deleteCart(req: Request, res: Response): Promise<void> {
    // @ts-expect-error: req.user is populated by Auth0 middleware and contains sub (user id)
    const userId = req.user?.sub; // Auth0 user ID (string)
    console.log('Auth0 sub:', userId);

    try {
      await CartService.deleteCart(userId);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  }
}

export default new CartController();
