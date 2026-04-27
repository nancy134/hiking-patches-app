import { test, expect } from "@playwright/test";
import { login } from "./helpers/login";

const PATCH_ID = "d2a1e7d3-b869-4b37-bd46-f77f04b905ee"; // Belknap Range

test.describe("Patch detail page (authenticated)", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`/patch/${PATCH_ID}`);
  });

  test("shows progress section instead of sign-in prompt", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Belknap", { timeout: 10000 });
    await expect(page.getByText(/sign in to mark your patch progress/i)).not.toBeVisible();
  });

  test("shows patch name and description", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Belknap", { timeout: 10000 });
    await expect(page.locator("p").first()).toBeVisible();
  });
});
