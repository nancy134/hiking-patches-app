import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("auth page loads sign-in form", async ({ page }) => {
    await page.goto("/auth");
    await expect(page.locator("input[type='email'], input[name='username']")).toBeVisible();
  });

  test("protected pages redirect to auth when not signed in", async ({ page }) => {
    await page.goto("/my-patches");
    await expect(page).toHaveURL(/auth/);
  });

  test("admin pages redirect to auth when not signed in", async ({ page }) => {
    await page.goto("/admin/patches");
    await expect(page).toHaveURL(/auth/);
  });
});
