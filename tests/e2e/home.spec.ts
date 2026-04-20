import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("patch grid loads at least one card", async ({ page }) => {
    await expect(page.locator('[data-testid="patch-card"]').first()).toBeVisible({ timeout: 10000 });
  });

  test("search filters patches by name", async ({ page }) => {
    await page.getByLabel("Search patches").fill("Belknap");
    await expect(page.locator('[data-testid="patch-card"]').first()).toBeVisible({ timeout: 10000 });
    const cards = page.locator('[data-testid="patch-card"]');
    await expect(cards).not.toHaveCount(0);
    for (const card of await cards.all()) {
      await expect(card).toContainText("Belknap", { ignoreCase: true });
    }
  });

  test("clearing search restores full patch list", async ({ page }) => {
    await expect(page.locator('[data-testid="patch-card"]').first()).toBeVisible({ timeout: 10000 });
    const totalBefore = await page.locator('[data-testid="patch-card"]').count();

    const search = page.getByLabel("Search patches");
    await search.fill("Belknap");
    await expect(page.locator('[data-testid="patch-card"]')).not.toHaveCount(totalBefore);

    await search.clear();
    await expect(page.locator('[data-testid="patch-card"]')).toHaveCount(totalBefore);
  });

  test("pagination advances to page 2 with different cards", async ({ page }) => {
    await expect(page.locator('[data-testid="patch-card"]').first()).toBeVisible({ timeout: 10000 });
    const firstPageHeadings = await page.locator('[data-testid="patch-card"] h2').allTextContents();

    await page.getByRole("button", { name: "Next", exact: true }).click();

    const secondPageHeadings = await page.locator('[data-testid="patch-card"] h2').allTextContents();
    expect(secondPageHeadings).not.toEqual(firstPageHeadings);
  });

  test("region filter shows only Maine patches", async ({ page }) => {
    await expect(page.locator('[data-testid="patch-card"]').first()).toBeVisible({ timeout: 10000 });
    const totalBefore = await page.locator('[data-testid="patch-card"]').count();

    await page.getByRole("button", { name: "Filters", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("combobox").first().selectOption("Maine");
    await dialog.getByRole("button", { name: "Done" }).click();

    const filtered = page.locator('[data-testid="patch-card"]');
    await expect(filtered.first()).toBeVisible({ timeout: 10000 });
    expect(await filtered.count()).toBeLessThan(totalBefore);
  });
});
