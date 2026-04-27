import { test, expect } from "@playwright/test";
import { login } from "./helpers/login";

const PATCH_ID = "d2a1e7d3-b869-4b37-bd46-f77f04b905ee"; // Belknap Range
const TEST_DATE = "2024-06-15";

test.describe("Add ascent (authenticated)", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`/patch/${PATCH_ID}`);
    await expect(page.locator("h1")).toContainText("Belknap", { timeout: 10000 });
  });

  test("can log and remove an ascent date for a mountain", async ({ page }) => {
    // Open the first mountain's ascent log
    const firstAscentButton = page.getByRole("button", { name: "Ascent Log" }).first();
    await expect(firstAscentButton).toBeVisible({ timeout: 10000 });
    await firstAscentButton.click();

    // Modal should open
    await expect(page.getByRole("heading", { name: /Update Ascents for/ })).toBeVisible({ timeout: 5000 });

    // Fill in the date
    await page.locator('input[type="date"]').first().fill(TEST_DATE);

    // Save
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByRole("heading", { name: /Update Ascents for/ })).not.toBeVisible({ timeout: 5000 });

    // Date should now appear in the table
    await expect(page.getByText(TEST_DATE)).toBeVisible({ timeout: 10000 });

    // Cleanup: reopen modal and remove the date
    await firstAscentButton.click();
    await expect(page.getByRole("heading", { name: /Update Ascents for/ })).toBeVisible({ timeout: 5000 });
    await page.getByRole("button", { name: "Remove" }).first().click();
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 5000 });
  });
});
