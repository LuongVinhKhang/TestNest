import { test, expect } from "@playwright/test";
import { ShopHomePage } from "pages/toolshop/shop/page.shop-home";

test.describe("Shop Home Page sorting and filtering", () => {
  let shopHomePage: ShopHomePage;

  test.beforeEach(async ({ page }) => {
    shopHomePage = new ShopHomePage(page);
    await shopHomePage.goto();
  });

  test("should display all expected sort options in the sort dropdown", async () => {
    const sortOptions = await shopHomePage.getAvailableSortOptions();
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

  test("should sort products by name in ascending order across all pages", async () => {
    await shopHomePage.selectSortingBy("name,asc");
    // Get total pages
    const pages = await shopHomePage.getPaginationNumbers();
    console.log("Total pages:", pages);
    const first = pages[0];
    const last = pages[pages.length - 1];
    const middle = pages.length > 2 ? pages[Math.floor(pages.length / 2)] : null;

    // Helper to check sorting on a page
    const checkSorted = async (pageNum: number) => {
      await shopHomePage.goToPage(pageNum);
      await expect
        .poll(async () => {
          const names = (await shopHomePage.getProductData()).map(p => p.name);
          const sorted = [...names].sort((a, b) => a.localeCompare(b));
          return JSON.stringify(names) === JSON.stringify(sorted);
        })
        .toBe(true);
    };

    await checkSorted(first);
    if (middle) await checkSorted(middle);
    await checkSorted(last);
  });
});
