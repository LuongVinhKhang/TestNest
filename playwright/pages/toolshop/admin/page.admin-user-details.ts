import { AdminBasePage } from "./page.admin-base";

export class AdminUserDetailsPage extends AdminBasePage {
  get elements() {
    return {
      ...super.elements,
      enabledCheckbox: () => this.page.getByTestId("enabled"),
      saveButton: () => this.page.getByTestId("user-submit"),
      userSavedLabel: () => this.page.getByText("User saved!"),
    };
  }

  async checkEnabled() {
    const isChecked = await this.elements.enabledCheckbox().isChecked();
    if (!isChecked) {
      await this.elements.enabledCheckbox().check();
    }
  }

  async uncheckEnabled() {
    const isChecked = await this.elements.enabledCheckbox().isChecked();
    if (isChecked) {
      await this.elements.enabledCheckbox().uncheck();
    }
  }

  async clickSave() {
    await this.elements.saveButton().click();
  }
}
