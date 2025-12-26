import { Page } from "@playwright/test";

export class BasePage {
  protected page: Page;

  get elements() {
    return {};
  }

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async reload() {
    await this.page.reload();
  }
}
