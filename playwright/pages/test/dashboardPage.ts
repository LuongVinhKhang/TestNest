import { Page } from "@playwright/test";
import { injectable, inject } from "tsyringe";
import { TYPES } from "@core/types";

@injectable()
export class DashboardPage {
  constructor(@inject(TYPES.Page) private page: Page) {}

  async getHeading() {
    return this.page.locator("h1").innerText();
  }
}
