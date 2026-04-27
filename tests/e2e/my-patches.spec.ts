import { test, expect } from "@playwright/test";
import { login } from "./helpers/login";

test.describe("My Patches page (authenticated)", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("loads without redirecting to auth", async ({ page }) => {
    await page.goto("/my-patches");
    await expect(page).toHaveURL(/\/my-patches/, { timeout: 10000 });
  });

  test("shows search and filters toolbar", async ({ page }) => {
    await page.goto("/my-patches");
    await expect(page.getByRole("button", { name: "Filters", exact: true })).toBeVisible({
      timeout: 10000,
    });
  });

  test("shows patch cards or empty state after user data loads", async ({ page }) => {
    await page.goto("/my-patches");
    const cards = page.locator('[data-testid="patch-card"]');
    const empty = page.getByText(/no patches yet/i);
    await expect(cards.first().or(empty)).toBeVisible({ timeout: 15000 });
  });
});

test.describe("Post-login redirect", () => {
  test("redirects back to my-patches after signing in from there", async ({ page }) => {
    await page.goto("/my-patches");
    await expect(page).toHaveURL(/\/auth\?redirect=\/my-patches/, { timeout: 10000 });

    await login(page, { navigate: false });

    await expect(page).toHaveURL(/\/my-patches/, { timeout: 15000 });
  });
});
