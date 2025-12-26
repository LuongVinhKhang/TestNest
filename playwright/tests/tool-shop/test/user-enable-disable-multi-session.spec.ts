import { expect, test } from "@playwright/test";
import { AdminUserDetailsPage } from "pages/toolshop/admin/page.admin-user-details";
import { AdminUsersPage } from "pages/toolshop/admin/page.admin-users";
import { CustomerMyAccountPage } from "pages/toolshop/customer/page.customer-my-account";
import { LogInPage } from "pages/toolshop/shared/auth/page.log-in";
import { HeaderSection } from "pages/toolshop/shared/section/section.header";

test.describe.configure({ mode: "serial" });
test.describe("User enable/disable across multiple sessions", () => {
  test("should prevent login for disabled user in a separate session", async ({ browser }) => {
    const email = "customer3@practicesoftwaretesting.com";
    const password = "pass123";

    // Admin session
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const adminHeaderSection = new HeaderSection(adminPage);
    const logInPage = new LogInPage(adminPage);
    const adminUsersPage = new AdminUsersPage(adminPage);
    const adminUserDetailsPage = new AdminUserDetailsPage(adminPage);

    await adminPage.goto("/");
    await adminHeaderSection.clickSignInLink();
    await logInPage.logInAs("admin@practicesoftwaretesting.com", "welcome01");
    await adminHeaderSection.selectMenuUsers();
    expect(await adminUsersPage.getUsersTableData()).toEqual(
      expect.arrayContaining([expect.objectContaining({ email })]),
    );
    await adminUsersPage.editUserByEmail(email);
    await adminUserDetailsPage.uncheckEnabled();
    await adminUserDetailsPage.clickSave();
    await expect(adminUserDetailsPage.elements.userSavedLabel()).toBeVisible();

    // Customer session
    const customerContext = await browser.newContext();
    const customerPage = await customerContext.newPage();
    const customerHeaderSection = new HeaderSection(customerPage);
    const customerLogInPage = new LogInPage(customerPage);

    await customerPage.goto("/");
    await customerHeaderSection.clickSignInLink();
    await customerLogInPage.logInAs(email, password);
    await expect(customerLogInPage.elements.logInButton()).toBeVisible();
    await expect(customerLogInPage.elements.loginErrorLabel()).toHaveText("Account disabled");
  });

  test("should allow login for re-enabled user in a separate session", async ({ browser }) => {
    const email = "customer3@practicesoftwaretesting.com";
    const password = "pass123";

    // Admin session
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const adminHeaderSection = new HeaderSection(adminPage);
    const logInPage = new LogInPage(adminPage);
    const adminUsersPage = new AdminUsersPage(adminPage);
    const adminUserDetailsPage = new AdminUserDetailsPage(adminPage);

    await adminPage.goto("/");
    await adminHeaderSection.clickSignInLink();
    await logInPage.logInAs("admin@practicesoftwaretesting.com", "welcome01");
    await adminHeaderSection.selectMenuUsers();
    expect(await adminUsersPage.getUsersTableData()).toEqual(
      expect.arrayContaining([expect.objectContaining({ email })]),
    );
    await adminUsersPage.editUserByEmail(email);
    await adminUserDetailsPage.checkEnabled();
    await adminUserDetailsPage.clickSave();
    await expect(adminUserDetailsPage.elements.userSavedLabel()).toBeVisible();

    // Customer session
    const customerContext = await browser.newContext();
    const customerPage = await customerContext.newPage();
    const customerHeaderSection = new HeaderSection(customerPage);
    const customerLogInPage = new LogInPage(customerPage);
    const customerMyAccountPage = new CustomerMyAccountPage(customerPage);

    await customerPage.goto("/");
    await customerHeaderSection.clickSignInLink();
    await customerLogInPage.logInAs(email, password);
    await expect(customerMyAccountPage.elements.titleLabel()).toBeVisible();

    await expect(customerMyAccountPage.elements.titleLabel()).not.toBeVisible();
  });
});
