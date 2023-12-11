import { redirect, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { getApiUrl } from "~/utils/api.server";

export const action = async ({ context, request }: ActionFunctionArgs) => {
  const apiUrl = getApiUrl(context);
  const response = await fetch(`${apiUrl}/session`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Cookie: request.headers.get("Cookie") || "",
    },
  });
  const cookie = response.headers.get("Set-Cookie") || "";
  return redirect("/", { headers: { "Set-Cookie": cookie } });
};
