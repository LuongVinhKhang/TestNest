import { BasePage } from "./page.base";

export class HeaderSection extends BasePage {
  get elements() {
    return {
      ...super.elements,
      homeLink: () => this.page.getByTestId("nav-home"),
      categoriesLink: () => this.page.getByTestId("nav-categories"),
      categoriesHandToolsLink: () => this.page.getByTestId("nav-hand-tools"),
      categoriesPowerToolsSubLink: () =>
        this.page.getByTestId("nav-power-tools"),
      categoriesOtherSubLink: () => this.page.getByTestId("nav-other"),
      categoriesSpecialToolsSubLink: () =>
        this.page.getByTestId("nav-special-tools"),
      categoriesRentalsLink: () => this.page.getByTestId("nav-rentals"),
      signInLink: () => this.page.getByTestId("nav-sign-in"),
    };
  }

  async clickHomeLink() {
    await this.elements.homeLink().click();
  }

  async selectHandToolsCategory() {
    await this.elements.categoriesLink().hover();
    await this.elements.categoriesHandToolsLink().click();
  }

  async selectPowerToolsCategory() {
    await this.elements.categoriesLink().hover();
    await this.elements.categoriesPowerToolsSubLink().click();
  }

  async selectOtherCategory() {
    await this.elements.categoriesLink().hover();
    await this.elements.categoriesOtherSubLink().click();
  }

  async selectSpecialToolsCategory() {
    await this.elements.categoriesLink().hover();
    await this.elements.categoriesSpecialToolsSubLink().click();
  }

  async selectRentalsCategory() {
    await this.elements.categoriesLink().hover();
    await this.elements.categoriesRentalsLink().click();
  }

  async clickSignInLink() {
    await this.elements.signInLink().click();
  }

  async clickSignInLinkInNewTab() {
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.elements.signInLink().click({ modifiers: [modifier] }),
    ]);
    return newPage;
  }
}
