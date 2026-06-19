import { expect, type Locator, type Page } from "@playwright/test";
import type { E2EUser } from "./e2eUsers";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:5173";

export async function signIn(page: Page, user: E2EUser) {
  await page.goto(appUrl("/auth"));
  await submitLoginForm(page, user);
  await expect(page).toHaveURL(/\/feeds$/);
}

export async function submitLoginForm(page: Page, user: E2EUser) {
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Login" }).click();
}

export function postCard(page: Page, content: string): Locator {
  return page.getByTestId("post-card").filter({ hasText: content }).first();
}

export function appUrl(path: string): string {
  return new URL(path, baseURL).toString();
}
