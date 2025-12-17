import { test, expect } from '@playwright/test';
import { ProductListingPage } from '../../page-objects/ProductListingPage';
import { CartPage } from '../../page-objects/CartPage';

// Test: Add product to cart & checkout
// Assumes user is already logged in or guest checkout is possible

test.describe('Add to Cart & Checkout', () => {
  test('should add product to cart and checkout', async ({ page }) => {
    const productPage = new ProductListingPage(page);
    const cartPage = new CartPage(page);

    await productPage.goto();
    await productPage.addFirstProductToCart();
    await productPage.goToCart();
    await cartPage.proceedToCheckout();
    // Add assertions for order confirmation page
    await expect(page).toHaveURL(/.*confirmation.*/);
  });

  test('should prompt login when checking out as guest', async ({ page }) => {
    const productPage = new ProductListingPage(page);
    const cartPage = new CartPage(page);

    await productPage.goto();
    await productPage.addFirstProductToCart();
    await productPage.goToCart();
    await cartPage.proceedToCheckout();
    // Assert login/register prompt
    await expect(page.getByRole('heading', { name: /login|register/i })).toBeVisible();
  });

  test('should remove product from cart', async ({ page }) => {
    const productPage = new ProductListingPage(page);
    const cartPage = new CartPage(page);

    await productPage.goto();
    await productPage.addFirstProductToCart();
    await productPage.goToCart();
    await cartPage.removeFirstProduct();
    await cartPage.expectCartEmpty();
  });

  test('should prevent checkout with empty cart', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.page.goto('/cart');
    await cartPage.proceedToCheckout();
    // Assert error or disabled checkout
    await expect(cartPage.checkoutButton).toBeDisabled();
  });
});
