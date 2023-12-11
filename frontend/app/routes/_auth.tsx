import { redirect, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { isAuthenticated } from "~/utils/auth.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  if (await isAuthenticated(request, context)) {
    throw redirect("/profile");
  }
  return null;
};
