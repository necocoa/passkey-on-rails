import { json, redirect, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { getApiUrl } from "~/utils/api.server";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const apiUrl = getApiUrl(context);

  const formData = await request.formData();
  const credential = formData.get("credential");

  const response = await fetch(`${apiUrl}/webauthn/assertion/session`, {
    method: "POST",
    body: credential,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Cookie: request.headers.get("Cookie") || "",
    },
  });
  const cookie = response.headers.get("Set-Cookie") || "";
  if (!response.ok) {
    const error = await response.json();
    throw json({ error }, { status: response.status, headers: { "Set-Cookie": cookie } });
  }

  return redirect("/profile", {
    status: 303,
    headers: { "Set-Cookie": cookie },
  });
};
