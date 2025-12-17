import { BasePage } from "./page.base";

export class ProductDetailsPage extends BasePage {
  get elements() {
    return {
      ...super.elements,
      productName: () => this.page.getByTestId("product-name"),
      productPrice: () => this.page.getByTestId("unit-price"),
      productCO2Rating: () =>
        this.page.getByTestId("co2-rating-badge").locator(".co2-letter.active"),
    };
  }

  async getProductName(): Promise<string> {
    return this.elements.productName().innerText();
  }

  async getProductPrice(): Promise<number> {
    const priceText = await this.elements.productPrice().innerText();
    return parseFloat(priceText.replace("$", ""));
  }

  async getProductCO2Rating(): Promise<string> {
    return this.elements.productCO2Rating().innerText();
  }
}
