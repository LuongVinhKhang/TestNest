import { CartItemModel } from './cart-item-model';

export default class CartModel {
  id: number;
  userId: number;
  items: CartItemModel[];

  constructor(id: number, userId: number, items: CartItemModel[]) {
    this.id = id;
    this.userId = userId;
    this.items = items;
  }
}
