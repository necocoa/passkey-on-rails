import { Form, useLoaderData } from "@remix-run/react";
import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/cloudflare";
import { getApiUrl } from "~/utils/api.server";

export const meta: MetaFunction = () => {
  return [{ title: "Profile" }];
};

type Profile = {
  username: string;
};

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const apiUrl = getApiUrl(context);
  const response = await fetch(`${apiUrl}/profile`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Cookie: request.headers.get("Cookie") || "",
    },
  });

  if (!response.ok) throw json({}, { status: response.status });
  const profile = (await response.json()) as Profile;
  return json({ profile });
};

export default function Profile() {
  const { profile } = useLoaderData<typeof loader>();

  return (
    <div className="hero h-full">
      <div className="hero-content w-screen">
        <div className="card w-96 bg-neutral text-neutral-content">
          <Form method="post" action="/session/destroy">
            <div className="card-body">
              <h2 className="card-title">Profile</h2>
              <p>Name: {profile.username}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-neutral">Logout</button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
