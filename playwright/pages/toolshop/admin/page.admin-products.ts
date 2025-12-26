import { TableComponent } from "../shared/component/component.table";
import { AdminBasePage } from "./page.admin-base";

type ProductTableRow = {
  id: string;
  name: string;
  stock: string;
  price: string;
};

export class AdminProductsPage extends AdminBasePage {
  get elements() {
    return {
      ...super.elements,
      searchTextBox: () => this.page.getByTestId("product-search-query"),
      searchButton: () => this.page.getByTestId("product-search-submit"),
      productTable: () => this.page.locator("table"),
    };
  }

  async searchForProduct(productName: string) {
    await this.elements.searchTextBox().fill(productName);
    await this.elements.searchButton().click();
  }

  async getProductsTableData(): Promise<ProductTableRow[]> {
    const rawRows = await TableComponent.extractTableDataViaLocators(this.elements.productTable());
    return rawRows.map((row: Record<string, string>) => ({
      id: row["Id"],
      name: row["Name"],
      stock: row["Stock"],
      price: row["Price"],
    }));
  }

  async editProductByName(productName: string) {
    await TableComponent.clickActionButtonByColumnValueLocator(
      this.elements.productTable(),
      "Name",
      productName,
      row => row.getByRole("link", { name: "Edit" }),
    );
    await this.page.waitForLoadState("networkidle");
  }
}
