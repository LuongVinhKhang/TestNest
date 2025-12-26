import { AdminBasePage } from "./page.admin-base";

export class AdminProductDetailsPage extends AdminBasePage {
  get elements() {
    return {
      ...super.elements,
      priceTextBox: () => this.page.getByTestId("price"),
      saveButton: () => this.page.getByTestId("product-submit"),
      productSavedLabel: () => this.page.getByText("Product saved!"),
    };
  }

  async fillPrice(price: number | string) {
    await this.page.waitForLoadState("networkidle");
    await this.elements.priceTextBox().fill(price.toString());
  }

  async clickSave() {
    await this.elements.saveButton().click();
  }
}
