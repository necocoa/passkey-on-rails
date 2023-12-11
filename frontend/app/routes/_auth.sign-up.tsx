import { useCallback, useEffect } from "react";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import { json } from "@remix-run/cloudflare";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { create } from "@github/webauthn-json";
import type { CredentialCreationOptionsJSON } from "@github/webauthn-json/browser-ponyfill";
import type { PublicKeyCredentialCreationOptionsJSON } from "node_modules/@github/webauthn-json/dist/types/basic/json";
import { getApiUrl } from "~/utils/api.server";

export const meta: MetaFunction = () => {
  return [{ title: "Sign Up" }];
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const apiUrl = getApiUrl(context);

  const formData = await request.formData();
  const username = formData.get("username");

  const response = await fetch(`${apiUrl}/webauthn/attestation/registration`, {
    method: "POST",
    body: JSON.stringify({ username }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Cookie: request.headers.get("Cookie") || "",
    },
  });
  const cookie = response.headers.get("Set-Cookie") || "";
  if (!response.ok) {
    const error = await response.json();
    return json({ credential: null, error }, { status: response.status, headers: { "Set-Cookie": cookie } });
  }

  const options = (await response.json()) as PublicKeyCredentialCreationOptionsJSON;
  return json({ credential: { publicKey: options } }, { status: response.status, headers: { "Set-Cookie": cookie } });
};

export default function SignUp() {
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();

  const createCredential = useCallback(async () => {
    if (actionData?.credential == null) {
      return;
    }

    const credentialWithAttestation = await create(actionData.credential as CredentialCreationOptionsJSON);
    const formData = new FormData();
    formData.append("credential", JSON.stringify(credentialWithAttestation));
    submit(formData, {
      action: "/sign-up/passkey",
      method: "post",
    });
  }, [actionData, submit]);

  useEffect(() => {
    createCredential();
  }, [actionData, createCredential]);

  return (
    <div className="hero h-full">
      <div className="hero-content w-screen">
        <div className="card w-96 bg-neutral text-neutral-content">
          <Form method="post">
            <div className="card-body">
              <h2 className="card-title">Sign Up</h2>
              <div className="form-control">
                <label htmlFor="username" className="label label-text text-neutral-content">
                  Username
                </label>
                <input
                  id="username"
                  type="username"
                  name="username"
                  placeholder="Username"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="card-actions">
                <button type="submit" className="btn btn-primary w-full">
                  Sign up
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
