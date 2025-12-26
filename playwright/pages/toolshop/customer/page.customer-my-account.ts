import { CustomerBasePage } from "./page.customer-base";

export class CustomerMyAccountPage extends CustomerBasePage {
  get elements() {
    return {
      ...super.elements,
      titleLabel: () => this.page.getByTestId("page-title"),
    };
  }
}
