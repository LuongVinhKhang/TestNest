import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly removeButton: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.getByRole('button', { name: /checkout/i });
    this.removeButton = page.getByRole('button', { name: /remove/i });
    this.cartItems = page.locator('.cart-item'); // Assumption: cart items have this class
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async removeFirstProduct() {
    await this.removeButton.first().click();
  }

  async expectCartEmpty() {
    await expect(this.cartItems).toHaveCount(0);
  }
}
