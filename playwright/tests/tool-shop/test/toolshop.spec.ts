import { test, expect } from "@playwright/test";
import { HomePage } from "pages/toolshop/page.home";

test.describe("Tool Shop Home Page", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test("should have correct sort options", async () => {
    const sortOptions = await homePage.getAvailableSortOptions();
    expect(sortOptions).toEqual(
      expect.arrayContaining([
        "Name (A - Z)",
        "Name (Z - A)",
        "Price (High - Low)",
        "Price (Low - High)",
        "CO₂ Rating (A - E)",
        "CO₂ Rating (E - A)",
      ]),
    );
  });

  test("should sort products by name ascending", async () => {
    await homePage.selectSortingBy("name,asc");
    // Get total pages
    const pages = await homePage.getPaginationNumbers();
    console.log("Total pages:", pages);
    const first = pages[0];
    const last = pages[pages.length - 1];
    const middle =
      pages.length > 2 ? pages[Math.floor(pages.length / 2)] : null;

    // Helper to check sorting on a page
    const checkSorted = async (pageNum: number) => {
      await homePage.goToPage(pageNum);
      await expect
        .poll(async () => {
          const names = (await homePage.getProductData()).map((p) => p.name);
          const sorted = [...names].sort((a, b) => a.localeCompare(b));
          return JSON.stringify(names) === JSON.stringify(sorted);
        })
        .toBe(true);
    };

    await checkSorted(first);
    if (middle) await checkSorted(middle);
    await checkSorted(last);
  });

  test("2 tabs to check the products on page 1", async () => {
    await homePage.goto();
    console.log("Products found:", await homePage.getProductData());
  });
});
