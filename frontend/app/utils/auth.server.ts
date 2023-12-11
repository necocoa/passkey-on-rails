import type { AppLoadContext } from "@remix-run/cloudflare";
import { getApiUrl } from "./api.server";
import type { AuthUser } from "./auth";

export const authentication = async (request: Request, context: AppLoadContext) => {
  const apiUrl = getApiUrl(context);
  const response = await fetch(`${apiUrl}/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Cookie: request.headers.get("Cookie") || "",
    },
  });

  if (!response.ok) {
    return { user: null };
  }
  const user = (await response.json()) as AuthUser;
  return { user };
};

export const isAuthenticated = async (request: Request, context: AppLoadContext) => {
  const apiUrl = getApiUrl(context);
  const response = await fetch(`${apiUrl}/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Cookie: request.headers.get("Cookie") || "",
    },
  });
  return response.ok;
};
