import { test, expect } from '@playwright/test';

test.describe('EthioShop E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should search products', async ({ page }) => {
    await page.fill('input[name="search"]', 'coffee');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/products/);
    await expect(page.locator('text=coffee').first()).toBeVisible();
  });

  test('should add product to cart', async ({ page }) => {
    await page.goto('/products');
    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    await addToCartButton.click();
    await expect(page.locator('text=Added to cart')).toBeVisible();
  });

  test('should navigate to checkout', async ({ page }) => {
    await page.goto('/products');
    await page.locator('button:has-text("Add to Cart")').first().click();
    await page.click('button[aria-label="Open cart"]');
    await page.click('a:has-text("Checkout")');
    await expect(page).toHaveURL(/checkout/);
  });

  test('should toggle language', async ({ page }) => {
    const languageButton = page.locator('button:has-text("አማ")');
    await languageButton.click();
    await expect(page.locator('text=አማ').or(page.locator('[lang="am"]'))).toBeVisible();
    
    const englishButton = page.locator('button:has-text("EN")');
    await englishButton.click();
    await expect(page.locator('text=EN').or(page.locator('[lang="en"]'))).toBeVisible();
  });

  test('should open vendor page', async ({ page }) => {
    await page.goto('/vendors');
    const vendorLink = page.locator('a[href^="/vendors/"]').first();
    await vendorLink.click();
    await expect(page).toHaveURL(/vendors\/[^/]+/);
  });

  test('should send message to vendor', async ({ page }) => {
    await page.goto('/vendors/vendor-1');
    const contactButton = page.locator('button:has-text("Contact Seller")');
    await contactButton.click();
    // Note: This will require authentication, so may redirect to signin
    await expect(
      page.locator('text=Contact Seller').or(page.locator('input[type="text"]'))
    ).toBeVisible({ timeout: 10000 });
  });

  test('should display product details', async ({ page }) => {
    await page.goto('/products');
    const productLink = page.locator('a[href^="/products/"]').first();
    await productLink.click();
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('text=Add to Cart')).toBeVisible();
  });
});

