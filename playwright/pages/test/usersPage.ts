import { injectable, inject } from "tsyringe";
import { Page } from "@playwright/test";
import { TYPES } from "@core/types";

@injectable()
export class UsersPage {
  constructor(@inject(TYPES.Page) private page: Page) {}

  async createUser(name: string) {
    await this.page.locator("#newUser").click();
    await this.page.fill("#name", name);
    await this.page.locator("button:has-text('Save')").click();
  }
}
