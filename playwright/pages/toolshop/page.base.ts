import { Page } from "@playwright/test";

export class BasePage {
  protected page: Page;

  get elements() {
    return {};
  }

  constructor(page: Page) {
    this.page = page;
  }
}
