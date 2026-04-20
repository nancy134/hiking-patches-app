import { test, expect } from "@playwright/test";

const PATCH_ID = "d2a1e7d3-b869-4b37-bd46-f77f04b905ee"; // Belknap Range

test.describe("Patch detail page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/patch/${PATCH_ID}`);
  });

  test("loads patch name and description without signing in", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Belknap", { timeout: 10000 });
    await expect(page.locator("p").first()).toBeVisible();
  });

  test("shows sign-in prompt for unauthenticated users", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/sign in to mark your patch progress/i)).toBeVisible();
  });

  test("does not redirect unauthenticated users", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(new RegExp(`/patch/${PATCH_ID}`));
  });
});
