import { expect, test } from "@playwright/test";
import {
  createPostViaApi,
  createVerifiedUser,
  deletePostViaApi,
  type E2EUser,
} from "./support/e2eUsers";
import { appUrl, postCard, signIn } from "./support/app";

let author: E2EUser;
let viewer: E2EUser;

test.describe("profile post menu", () => {
  test.beforeAll(async ({ request }) => {
    author = await createVerifiedUser(request, "ProfileAuthor");
    viewer = await createVerifiedUser(request, "ProfileViewer");
  });

  test("shows post menu to the author and hides it from another user", async ({
    browser,
    request,
  }) => {
    const content = `E2E menu visibility ${Date.now()}`;
    let postId: string | null = null;
    let authorContext: Awaited<ReturnType<typeof browser.newContext>> | null =
      null;
    let viewerContext: Awaited<ReturnType<typeof browser.newContext>> | null =
      null;

    postId = await createPostViaApi(request, author, content);

    try {
      authorContext = await browser.newContext();
      viewerContext = await browser.newContext();

      const authorPage = await authorContext.newPage();
      await signIn(authorPage, author);

      const authorCard = postCard(authorPage, content);
      await expect(authorCard).toBeVisible();
      await expect(authorCard.getByTestId("post-menu-trigger")).toBeVisible();

      const viewerPage = await viewerContext.newPage();
      await signIn(viewerPage, viewer);
      await viewerPage.goto(appUrl(`/profile/${author.id}`));

      const viewerCard = postCard(viewerPage, content);
      await expect(viewerCard).toBeVisible();
      await expect(viewerCard.getByTestId("post-menu-trigger")).toHaveCount(0);
    } finally {
      await authorContext?.close();
      await viewerContext?.close();
      await deletePostViaApi(request, author, postId);
    }
  });
});
