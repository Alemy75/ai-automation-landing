// tests/e2e/landing.spec.ts
import { test, expect } from '@playwright/test';

test.describe('AI Boost Landing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/AI Boost/);
  });

  test('h1 contains AI Boost branding', async ({ page }) => {
    const h1 = page.locator('#hero h1');
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('AI Boost');
  });

  test('desktop nav links are present', async ({ page }) => {
    const header = page.locator('header');
    await expect(header.getByRole('link', { name: 'Услуги' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Кейсы' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'FAQ' })).toBeVisible();
  });

  test('services section has 4 cards', async ({ page }) => {
    const section = page.locator('#services');
    await section.scrollIntoViewIfNeeded();
    await expect(section.locator('h3')).toHaveCount(4);
  });

  test('FAQ accordion opens and closes', async ({ page }) => {
    await page.locator('#faq').scrollIntoViewIfNeeded();
    const firstTrigger = page.locator('.faq-trigger').first();
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
    await firstTrigger.click();
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
    await firstTrigger.click();
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('contact form is visible', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.locator('#contact-form')).toBeVisible();
    await expect(page.locator('#cf-name')).toBeVisible();
    await expect(page.locator('#cf-email')).toBeVisible();
    await expect(page.locator('#cf-message')).toBeVisible();
  });

  test('comparison table is visible', async ({ page }) => {
    await page.locator('#ai-vs-team').scrollIntoViewIfNeeded();
    await expect(page.locator('#ai-vs-team')).toBeVisible();
  });

  test('mobile burger opens drawer', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator('#burger-btn')).toBeVisible();
    await page.locator('#burger-btn').click();
    await expect(page.locator('#burger-btn')).toHaveAttribute('aria-expanded', 'true');
  });
});
