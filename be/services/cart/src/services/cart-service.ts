import { PrismaClient } from '@prisma/client';
import { CartItemModel } from '../model/cart-item-model';
import CartModel from '../model/cart-model';

const prisma = new PrismaClient();

class CartService {
  async getCartByUserId(userId: number): Promise<CartModel | null> {
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      return null;
    }

    const cartItems = cart.items.map(
      (item) =>
        new CartItemModel(item.id, item.cartId, item.productId, item.quantity),
    );

    return new CartModel(cart.id, cart.userId, cartItems);
  }

  async createCart(userId: number, items: CartItemModel[]): Promise<CartModel> {
    const cart = await prisma.cart.create({
      data: {
        userId,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    const cartItems = cart.items.map(
      (item) =>
        new CartItemModel(item.id, item.cartId, item.productId, item.quantity),
    );

    return new CartModel(cart.id, cart.userId, cartItems);
  }

  async updateCart(
    userId: number,
    items: CartItemModel[],
  ): Promise<CartModel | null> {
    const cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      return null;
    }

    const updatedCart = await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: {
          deleteMany: {},
          create: items.map((item: CartItemModel) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    const cartItems = updatedCart.items.map(
      (item: CartItemModel) =>
        new CartItemModel(item.id, item.cartId, item.productId, item.quantity),
    );

    return new CartModel(updatedCart.id, updatedCart.userId, cartItems);
  }

  async deleteCart(userId: number): Promise<void> {
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    await prisma.cart.delete({
      where: { id: cart.id },
    });
  }
}

export default new CartService();
