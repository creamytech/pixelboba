import { test, expect } from '@playwright/test';

test.describe('Pixel Boba Website Smoke Tests', () => {
  test('homepage loads and displays main elements', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/Pixel Boba/);

    // Check hero section
    await expect(page.locator('h1')).toContainText('Websites that Pop');
    await expect(page.getByRole('link', { name: 'Start a Project' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'See Our Work' })).toBeVisible();

    // Check navigation
    await expect(page.getByRole('link', { name: 'Work' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Services' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();
  });

  test('navigation works correctly', async ({ page }) => {
    await page.goto('/');

    // Test Work page
    await page.getByRole('link', { name: 'Work' }).click();
    await expect(page).toHaveURL('/work');
    await expect(page.locator('h1')).toContainText('Our Work');

    // Test Services page
    await page.getByRole('link', { name: 'Services' }).click();
    await expect(page).toHaveURL('/services');
    await expect(page.locator('h1')).toContainText('What We Do');

    // Test About page
    await page.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL('/about');
    await expect(page.locator('h1')).toContainText('About Us');

    // Test Contact page
    await page.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL('/contact');
    await expect(page.locator('h1')).toContainText("Let's Talk");
  });

  test('contact form renders and validates', async ({ page }) => {
    await page.goto('/contact');

    // Check form elements
    await expect(page.getByLabel('Name *')).toBeVisible();
    await expect(page.getByLabel('Email *')).toBeVisible();
    await expect(page.getByLabel('Project Details *')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send Message' })).toBeVisible();

    // Test form validation
    await page.getByRole('button', { name: 'Send Message' }).click();

    // Should show browser validation messages for required fields
    const nameField = page.getByLabel('Name *');
    await expect(nameField).toBeFocused();
  });

  test('responsive navigation menu works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Mobile menu button should be visible
    const menuButton = page.locator('button[aria-label*="menu"], button:has(svg)').first();
    await expect(menuButton).toBeVisible();

    // Click menu button
    await menuButton.click();

    // Navigation items should be visible in mobile menu
    await expect(page.getByRole('link', { name: 'Work' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Services' })).toBeVisible();
  });

  test('work page displays portfolio items', async ({ page }) => {
    await page.goto('/work');

    await expect(page.locator('h1')).toContainText('Our Work');

    // Should have either work items or a "coming soon" message
    const hasWorkItems = await page.locator('.grid').isVisible();
    const hasComingSoon = await page.getByText('Portfolio Coming Soon').isVisible();

    expect(hasWorkItems || hasComingSoon).toBeTruthy();
  });

  test('services page displays all service cards', async ({ page }) => {
    await page.goto('/services');

    await expect(page.locator('h1')).toContainText('What We Do');

    // Check for service cards
    await expect(page.getByText('Web Design')).toBeVisible();
    await expect(page.getByText('Next.js Development')).toBeVisible();
    await expect(page.getByText('Performance')).toBeVisible();
  });

  test('process page displays all process steps', async ({ page }) => {
    await page.goto('/process');

    await expect(page.locator('h1')).toContainText('Our Process');

    // Check for process steps
    await expect(page.getByText('Shake')).toBeVisible();
    await expect(page.getByText('Brew')).toBeVisible();
    await expect(page.getByText('Layer')).toBeVisible();
    await expect(page.getByText('Pop')).toBeVisible();
    await expect(page.getByText('Launch')).toBeVisible();
    await expect(page.getByText('Iterate')).toBeVisible();
  });

  test('footer contains all expected links', async ({ page }) => {
    await page.goto('/');

    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();

    // Check social links
    await expect(page.getByRole('link', { name: 'Twitter' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Instagram' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'GitHub' })).toBeVisible();

    // Check legal links
    await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Terms of Service' })).toBeVisible();
  });

  test('legal pages load correctly', async ({ page }) => {
    // Privacy page
    await page.goto('/legal/privacy');
    await expect(page.locator('h1')).toContainText('Privacy Policy');

    // Terms page
    await page.goto('/legal/terms');
    await expect(page.locator('h1')).toContainText('Terms of Service');
  });

  test('404 page displays correctly', async ({ page }) => {
    await page.goto('/non-existent-page');

    await expect(page.locator('h1')).toContainText('404');
    await expect(page.getByText('This page got lost in the tea')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Go Home' })).toBeVisible();
  });
});
