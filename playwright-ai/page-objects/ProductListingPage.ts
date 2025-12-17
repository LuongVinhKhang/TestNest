import { Page, Locator } from '@playwright/test';

export class ProductListingPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.cartLink = page.getByRole('link', { name: /cart/i });
  }

  async goto() {
    await this.page.goto('/');
  }

  async addFirstProductToCart() {
    // Assumption: first product has an 'Add to Cart' button
    await this.addToCartButton.first().click();
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
