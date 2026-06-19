import type { APIRequestContext, APIResponse } from "@playwright/test";

export type E2EUser = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  id: string;
  wallId: string;
  token: string;
};

const mailpitUrl = process.env.E2E_MAILPIT_URL ?? "http://127.0.0.1:8025";

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function createVerifiedUser(
  request: APIRequestContext,
  label: string,
): Promise<E2EUser> {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const safeLabel = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const email = `e2e-${safeLabel}-${suffix}@example.test`;
  const password = "Password123!";
  const firstName = "E2E";
  const lastName = label;

  const registerResponse = await request.post("/api/auth/register", {
    data: {
      email,
      firstName,
      lastName,
      password,
      dateOfBirth: "1990-01-01",
    },
  });

  if (!registerResponse.ok()) {
    throw new Error(
      `Failed to register ${email}: ${await responseSummary(registerResponse)}`,
    );
  }

  const verificationLink = await waitForVerificationLink(request, email);
  const verifyResponse = await request.get(verificationLink, {
    maxRedirects: 0,
  });

  if (![200, 302, 303].includes(verifyResponse.status())) {
    throw new Error(
      `Failed to verify ${email}: ${await responseSummary(verifyResponse)}`,
    );
  }

  const token = await loginViaApi(request, email, password);
  const meResponse = await request.get("/api/me", {
    headers: authHeaders(token),
  });

  if (!meResponse.ok()) {
    throw new Error(
      `Failed to fetch /me for ${email}: ${await responseSummary(meResponse)}`,
    );
  }

  const me = (await meResponse.json()) as { id?: string; wallId?: string };
  if (!me.id || !me.wallId) {
    throw new Error(
      `Unexpected /me response for ${email}: ${JSON.stringify(me)}`,
    );
  }

  return {
    email,
    password,
    firstName,
    lastName,
    id: me.id,
    wallId: me.wallId,
    token,
  };
}

export async function createPostViaApi(
  request: APIRequestContext,
  user: E2EUser,
  content: string,
): Promise<string> {
  const response = await request.post(`/api/posts/${user.wallId}`, {
    headers: authHeaders(user.token),
    data: {
      content,
      visibility: "public",
      mediaIds: [],
    },
  });

  if (!response.ok()) {
    throw new Error(
      `Failed to create post: ${await responseSummary(response)}`,
    );
  }

  const body = (await response.json()) as { id?: string };
  if (!body.id) {
    throw new Error(`Unexpected create post response: ${JSON.stringify(body)}`);
  }

  return body.id;
}

export async function deletePostViaApi(
  request: APIRequestContext,
  user: E2EUser,
  postId: string | null | undefined,
): Promise<void> {
  if (!postId) return;

  const response = await request.delete(`/api/posts/${postId}`, {
    headers: authHeaders(user.token),
  });

  if (!response.ok() && response.status() !== 404) {
    throw new Error(
      `Failed to delete post ${postId}: ${await responseSummary(response)}`,
    );
  }
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

async function loginViaApi(
  request: APIRequestContext,
  email: string,
  password: string,
): Promise<string> {
  const response = await request.post("/api/auth/login", {
    data: { email, password },
  });

  if (!response.ok()) {
    throw new Error(
      `Failed to login ${email}: ${await responseSummary(response)}`,
    );
  }

  const body = (await response.json()) as { token?: string };
  if (!body.token) {
    throw new Error(`Unexpected login response: ${JSON.stringify(body)}`);
  }

  return body.token;
}

async function waitForVerificationLink(
  request: APIRequestContext,
  email: string,
): Promise<string> {
  let lastError = "";

  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const messages = await fetchMailpitMessages(request);

      for (const message of messages) {
        if (!messageHasRecipient(message, email)) continue;

        const id = message.ID ?? message.Id ?? message.id;
        if (!id) continue;

        const detailResponse = await request.get(
          `${mailpitUrl}/api/v1/message/${encodeURIComponent(String(id))}`,
        );

        if (!detailResponse.ok()) continue;

        const detail = await detailResponse.json();
        const link = extractVerificationLink(detail);
        if (link) return link;
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    await pause(1_000);
  }

  throw new Error(
    `Verification email for ${email} was not found in Mailpit at ${mailpitUrl}. ` +
      `Run the local stack with Mailpit enabled. Last error: ${lastError || "none"}`,
  );
}

async function fetchMailpitMessages(
  request: APIRequestContext,
): Promise<Record<string, unknown>[]> {
  const response = await request.get(`${mailpitUrl}/api/v1/messages?limit=100`);

  if (!response.ok()) {
    throw new Error(`Mailpit returned ${response.status()}`);
  }

  const body = (await response.json()) as {
    messages?: Record<string, unknown>[];
    Messages?: Record<string, unknown>[];
  };

  return body.messages ?? body.Messages ?? [];
}

function messageHasRecipient(message: Record<string, unknown>, email: string) {
  return JSON.stringify(message).toLowerCase().includes(email.toLowerCase());
}

function extractVerificationLink(detail: unknown): string | null {
  const text = JSON.stringify(detail).replaceAll("&amp;", "&");
  const match = text.match(
    /(https?:\/\/[^"'<>\\\s]+\/api\/auth\/verify-email\?token=[^"'<>\\\s]+|\/api\/auth\/verify-email\?token=[^"'<>\\\s]+)/,
  );

  if (!match) return null;

  return new URL(
    match[0],
    process.env.E2E_API_ORIGIN ?? "http://localhost:8080",
  )
    .toString()
    .replace(/\\u0026/g, "&");
}

async function responseSummary(response: APIResponse): Promise<string> {
  const contentType = response.headers()["content-type"] ?? "unknown";
  const text = (await response.text()).replace(/\s+/g, " ").trim();
  const body = text.length > 500 ? `${text.slice(0, 500)}...` : text;

  return `${response.status()} ${response.statusText()} (${contentType}) ${body}`;
}
