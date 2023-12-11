import type { FormEventHandler } from "react";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/cloudflare";
import { get } from "@github/webauthn-json";
import type {
  CredentialRequestOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from "node_modules/@github/webauthn-json/dist/types/basic/json";
import { getApiUrl } from "~/utils/api.server";

export const meta: MetaFunction = () => {
  return [{ title: "Sign In" }];
};

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const apiUrl = getApiUrl(context);
  const response = await fetch(`${apiUrl}/webauthn/assertion/options`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Set-Cookie": request.headers.get("Cookie") || "",
    },
  });
  const cookie = response.headers.get("Set-Cookie") || "";
  if (!response.ok) {
    throw json(
      { message: "Failed to fetch credential options" },
      {
        status: response.status,
        headers: { "Set-Cookie": cookie },
      }
    );
  }

  const options = (await response.json()) as PublicKeyCredentialRequestOptionsJSON;
  return json(
    { credential: { publicKey: options } },
    {
      status: 200,
      headers: { "Set-Cookie": cookie },
    }
  );
};

export default function SignIn() {
  const submit = useSubmit();
  const { credential } = useLoaderData<typeof loader>();

  const onSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
    const credentialWithAssertion = await get(credential as CredentialRequestOptionsJSON);
    const formData = new FormData();
    formData.append("credential", JSON.stringify(credentialWithAssertion));
    submit(formData, { action: "/sign-in/passkey", method: "post" });
  };

  return (
    <div className="hero h-full">
      <div className="hero-content w-screen">
        <div className="card w-96 bg-neutral text-neutral-content">
          <Form method="post" onSubmit={onSubmit}>
            <div className="card-body">
              <h2 className="card-title">Sign In with a passkey</h2>
              <div className="card-actions">
                <button type="submit" className="btn btn-primary w-full">
                  Sign in with a passkey
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
