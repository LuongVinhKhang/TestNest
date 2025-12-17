import { Locator, Page } from "@playwright/test";
import { BasePage } from "./page.base";

export type SortOption =
  | "name,asc"
  | "name,desc"
  | "price,asc"
  | "price,desc"
  | "co2_rating,asc"
  | "co2_rating,desc";

export class HomePage extends BasePage {
  get elements() {
    return {
      ...super.elements,
      searchTextBox: () => this.page.getByRole("textbox", { name: "Search" }),
      searchButton: () => this.page.getByRole("button", { name: "Search" }),

      productItems: () => this.page.locator("a.card"),
      paginationButton: (pageNumber: number) =>
        this.page.getByRole("button", { name: `Page-${pageNumber}` }),
      previousButton: () => this.page.getByRole("button", { name: "Previous" }),
      nextButton: () => this.page.getByRole("button", { name: "Next" }),
    };
  }

  async goto() {
    await this.page.goto("http://localhost:4200/");
  }

  async getAvailableSortOptions(): Promise<string[]> {
    return this.page.locator('[data-test="sort"] option').allTextContents();
  }

  async selectSortingBy(option: SortOption) {
    await this.page.locator('[data-test="sort"]').selectOption(option);
  }

  async fillSearchText(text: string) {
    await this.elements.searchTextBox().fill(text);
  }

  async clickSearchButton() {
    await this.elements.searchButton().click();
  }

  async searchForProduct(text: string) {
    await this.fillSearchText(text);
    await this.clickSearchButton();
  }

  async getProductData(): Promise<
    { name: string; price: number; co2Rating: string }[]
  > {
    await this.elements.productItems().first().waitFor({ state: "visible" });
    const productsCount = await this.elements.productItems().count();
    const products = [];

    for (let i = 0; i < productsCount; i++) {
      console.log(`Fetching data for product ${i + 1}/${productsCount}`);
      const product = this.elements.productItems().nth(i);
      const name = await product.getByTestId("product-name").innerText();
      const priceText = await product.getByTestId("product-price").innerText();
      const co2Rating = await product
        .getByTestId("co2-rating-badge")
        .locator(".co2-letter.active")
        .innerText();
      const price = parseFloat(priceText.replace("$", ""));

      products.push({ name, price, co2Rating });
    }
    return products;
  }

  // Pagination Actions
  async goToPage(pageNumber: number) {
    await this.elements.paginationButton(pageNumber).click();
  }

  async goToNextPage() {
    await this.elements.nextButton().click();
  }

  async goToPreviousPage() {
    await this.elements.previousButton().click();
  }

  async getCurrentPageNumber(): Promise<number> {
    // Assumes the current page button is disabled or has aria-current
    const current = await this.page
      .getByRole("button", { selected: true })
      .innerText();
    return parseInt(current, 10);
  }

  async getPaginationNumbers(): Promise<number[]> {
    const texts = await this.page
      .locator('a[role="button"][aria-label^="Page-"]')
      .allTextContents();
    const numbers = texts
      .map((text) => parseInt(text, 10))
      .filter((num) => !isNaN(num));
    return numbers;
  }
}
