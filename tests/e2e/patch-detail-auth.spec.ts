import { test, expect } from "@playwright/test";
import { login } from "./helpers/login";

const PATCH_ID = "9e42d722-e9dc-4b53-8af6-469ea93baf1c"; // Belknap Range — prod's id, valid in every env since the catalogue reseed

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
