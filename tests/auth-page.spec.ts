import { expect, test } from "@playwright/test";
import { createVerifiedUser, type E2EUser } from "./support/e2eUsers";
import { appUrl, submitLoginForm } from "./support/app";

let user: E2EUser;

test.describe("auth page", () => {
  test.beforeAll(async ({ request }) => {
    user = await createVerifiedUser(request, "Auth");
  });

  test("redirects guests to auth page and signs in", async ({ page }) => {
    await page.goto(appUrl("/feeds"));

    await expect(page).toHaveURL(/\/auth\?redirectTo=%2Ffeeds$/);
    await expect(
      page.getByRole("heading", { name: "Welcome back" }),
    ).toBeVisible();

    await submitLoginForm(page, user);

    await expect(page).toHaveURL(/\/feeds$/);
    await expect(page.getByRole("button", { name: "New Post" })).toBeVisible();
  });
});
