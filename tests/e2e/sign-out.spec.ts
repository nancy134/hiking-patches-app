import { test, expect } from "@playwright/test";
import { login } from "./helpers/login";

test.describe("Sign out", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("log out button redirects to auth", async ({ page }) => {
    await page.goto("/account");
    await expect(page.getByRole("heading", { name: "Your Account" })).toBeVisible({
      timeout: 10000,
    });

    await page.getByRole("button", { name: "Log Out" }).click();

    await expect(page).toHaveURL(/\/auth/, { timeout: 10000 });
  });

  test("visiting my-patches after sign-out redirects to auth", async ({ page }) => {
    await page.goto("/account");
    await expect(page.getByRole("heading", { name: "Your Account" })).toBeVisible({
      timeout: 10000,
    });

    await page.getByRole("button", { name: "Log Out" }).click();
    await expect(page).toHaveURL(/\/auth/, { timeout: 10000 });

    await page.goto("/my-patches");
    await expect(page).toHaveURL(/\/auth\?redirect=\/my-patches/, { timeout: 10000 });
  });
});
