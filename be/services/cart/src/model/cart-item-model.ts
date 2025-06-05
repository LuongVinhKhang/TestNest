export class CartItemModel {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;

  constructor(id: number, cartId: number, productId: number, quantity: number) {
    this.id = id;
    this.cartId = cartId;
    this.productId = productId;
    this.quantity = quantity;
  }
}
