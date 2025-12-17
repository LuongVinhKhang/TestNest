import { test } from "@playwright/test";
import { HomePage } from "pages/toolshop/page.home";
import { ProductDetailsPage } from "pages/toolshop/page.product-details";
import { LogInPage } from "pages/toolshop/page.log-in";
import { HeaderSection } from "pages/toolshop/section.header";

test.describe("Tool Shop Home Page", () => {
  test("open multiple tabs", async ({ browser }) => {
    const context = await browser.newContext();
    const productPage = await context.newPage();

    const homePage = new HomePage(productPage);
    const headerSection = new HeaderSection(productPage);
    const productDetailsPage = new ProductDetailsPage(productPage);

    await homePage.goto();
    console.log("Products found:", await homePage.getProductData());
    await homePage.searchForProduct("Claw Hammer with Shock Reduction Grip");
    const products = await homePage.getProductData();
    console.log("Products found:", products);

    // const [adminPage] = await Promise.all([
    //   context.waitForEvent("page"),
    //   await headerSection.clickSignInLinkInNewTab(),
    // ]);

    // const logInPage = new LogInPage(adminPage);
    // await logInPage.logInAs("admin@practicesoftwaretesting.com", "welcome01");

    // await browser.close();
  });
});
