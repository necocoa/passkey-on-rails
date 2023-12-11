import type { AppLoadContext } from "@remix-run/cloudflare";
import type { Env } from "~/global";

export const getApiUrl = (context: AppLoadContext) => {
  const env = context.env as Env;
  return env.API_URL;
};
