import { Page } from "@playwright/test";

export async function login(page: Page) {
  const email = process.env.E2E_TEST_EMAIL;
  const password = process.env.E2E_TEST_PASSWORD;

  if (!email || !password) {
    throw new Error("E2E_TEST_EMAIL and E2E_TEST_PASSWORD must be set in .env.local");
  }

  await page.goto("/auth");
  await page.getByPlaceholder("Enter your Email").fill(email);
  await page.getByPlaceholder("Enter your Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  // Wait until redirected away from /auth
  await page.waitForURL((url) => !url.pathname.startsWith("/auth"), { timeout: 15000 });
}
