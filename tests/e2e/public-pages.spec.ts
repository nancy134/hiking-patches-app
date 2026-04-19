import { test, expect } from "@playwright/test";

test.describe("Public pages", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/hiking patches/i);
  });

  test("about page loads", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("safety page loads", async ({ page }) => {
    await page.goto("/safety");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("popular patches page loads", async ({ page }) => {
    await page.goto("/popular");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("request patch page loads", async ({ page }) => {
    await page.goto("/request-patch");
    await expect(page.locator("h1")).toBeVisible();
  });
});
