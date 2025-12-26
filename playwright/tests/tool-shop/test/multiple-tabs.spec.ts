import { expect, test } from "@playwright/test";
import { AdminProductDetailsPage } from "pages/toolshop/admin/page.admin-product-details";
import { AdminProductsPage } from "pages/toolshop/admin/page.admin-products";
import { LogInPage } from "pages/toolshop/shared/auth/page.log-in";
import { HeaderSection } from "pages/toolshop/shared/section/section.header";
import { ShopHomePage } from "pages/toolshop/shop/page.shop-home";
import { ShopProductDetailsPage } from "pages/toolshop/shop/page.shop-product-details";

test.describe("Admin updates product price in new tab and verifies on shop home", () => {
  test("should reflect updated product price on shop home after admin changes price in another tab", async ({
    browser,
  }) => {
    const productName = "Claw Hammer with Shock Reduction Grip";
    const context = await browser.newContext();
    const productPage = await context.newPage();

    const headerSection = new HeaderSection(productPage);
    const homePage = new ShopHomePage(productPage);
    const productDetailsPage = new ShopProductDetailsPage(productPage);
    await homePage.goto();
    await homePage.searchForProduct(productName);
    const productData = await homePage.getProductData();
    expect(productData).toEqual([expect.objectContaining({ name: productName })]);
    const currentPrice = productData[0].price;

    const adminPage = await headerSection.clickSignInLinkInNewTab();
    const adminHeaderSection = new HeaderSection(adminPage);
    const logInPage = new LogInPage(adminPage);
    const adminProductsPage = new AdminProductsPage(adminPage);
    const adminProductDetailsPage = new AdminProductDetailsPage(adminPage);
    const newPrice = (currentPrice + 1).toFixed(2);
    await adminPage.bringToFront();
    await logInPage.logInAs("admin@practicesoftwaretesting.com", "welcome01");
    await adminHeaderSection.selectMenuProducts();
    await adminProductsPage.searchForProduct(productName);
    await adminProductsPage.editProductByName(productName);
    await adminProductDetailsPage.fillPrice(newPrice);
    await adminProductDetailsPage.clickSave();
    await expect(adminProductDetailsPage.elements.productSavedLabel()).toBeVisible();

    await productPage.bringToFront();
    await homePage.reload();
    await homePage.searchForProduct(productName);
    const updatedProductData = await homePage.getProductData();
    expect(updatedProductData).toEqual([
      expect.objectContaining({ name: productName, price: parseFloat(newPrice) }),
    ]);
  });
});
