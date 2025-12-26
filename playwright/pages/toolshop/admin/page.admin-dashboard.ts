import { AdminBasePage } from "./page.admin-base";

export class AdminDashboardPage extends AdminBasePage {
  get elements() {
    return {
      ...super.elements,
    };
  }

  async goto() {
    await this.page.goto("http://localhost:4200/");
  }
}
