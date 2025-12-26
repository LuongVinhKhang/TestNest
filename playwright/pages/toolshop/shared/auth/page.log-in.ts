import { BasePage } from "../page.base";

export class LogInPage extends BasePage {
  get elements() {
    return {
      ...super.elements,
      emailTextBox: () => this.page.getByTestId("email"),
      passwordTextBox: () => this.page.getByTestId("password"),
      logInButton: () => this.page.getByTestId("login-submit"),
      loginErrorLabel: () => this.page.getByTestId("login-error"),
    };
  }

  async fillEmail(email: string) {
    await this.elements.emailTextBox().fill(email);
  }

  async fillPassword(password: string) {
    await this.elements.passwordTextBox().fill(password);
  }

  async clickLogIn() {
    await this.elements.logInButton().click();
  }

  async logInAs(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogIn();
  }
}
