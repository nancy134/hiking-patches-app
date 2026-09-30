import { test, expect } from "@playwright/test";

const PATCH_ID = "9e42d722-e9dc-4b53-8af6-469ea93baf1c"; // Belknap Range — prod's id, valid in every env since the catalogue reseed

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
    await expect(page.getByText(/track your progress on this patch/i)).toBeVisible();
    // The prompt is a call to action now, so assert the link exists and carries
    // the redirect back to this patch — the old static prompt had no link.
    await expect(page.locator('a[href^="/auth?redirect="]')).toBeVisible();
  });

  test("does not redirect unauthenticated users", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(new RegExp(`/patch/${PATCH_ID}`));
  });
});
