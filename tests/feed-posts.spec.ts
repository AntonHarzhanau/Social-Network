import { expect, test } from "@playwright/test";
import {
  createVerifiedUser,
  deletePostViaApi,
  type E2EUser,
} from "./support/e2eUsers";
import { postCard, signIn } from "./support/app";

let author: E2EUser;

test.describe("feed posts", () => {
  test.beforeAll(async ({ request }) => {
    author = await createVerifiedUser(request, "Feed");
  });

  test("creates and deletes a post from the feed", async ({
    page,
    request,
  }) => {
    const content = `E2E create-delete ${Date.now()}`;
    let postId: string | null = null;

    try {
      await signIn(page, author);

      await page.getByRole("button", { name: "New Post" }).click();

      const dialog = page.getByRole("dialog", { name: "New Post" });
      await expect(dialog).toBeVisible();
      await dialog.getByLabel("Content").fill(content);

      const createResponsePromise = page.waitForResponse(
        (response) =>
          response.request().method() === "POST" &&
          /\/api\/posts\/[^/]+$/.test(new URL(response.url()).pathname),
      );

      await dialog.getByRole("button", { name: "Publish" }).click();

      const createResponse = await createResponsePromise;
      expect(createResponse.status()).toBe(201);
      postId = ((await createResponse.json()) as { id: string }).id;

      const card = postCard(page, content);
      await expect(dialog).toBeHidden();
      await expect(card).toBeVisible();
      await expect(card.getByTestId("post-menu-trigger")).toBeVisible();

      const deleteResponsePromise = page.waitForResponse(
        (response) =>
          response.request().method() === "DELETE" &&
          response.url().includes(`/api/posts/${postId}`),
      );

      await card.getByTestId("post-menu-trigger").click();
      await page.getByRole("menuitem", { name: "Delete" }).click();

      const deleteResponse = await deleteResponsePromise;
      expect(deleteResponse.ok()).toBeTruthy();
      await expect(card).toBeHidden();
    } finally {
      await deletePostViaApi(request, author, postId);
    }
  });
});
