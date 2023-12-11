import { Link, useLoaderData } from "@remix-run/react";
import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/cloudflare";
import { isAuthenticated } from "~/utils/auth.server";

export const meta: MetaFunction = () => {
  return [{ title: "Let's try passkey" }];
};

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const authenticated = await isAuthenticated(request, context);
  return json({ authenticated });
};

export default function Index() {
  const { authenticated } = useLoaderData<typeof loader>();

  return (
    <div className="hero h-full">
      <div className="hero-content w-screen">
        <div className="card w-96 bg-neutral text-neutral-content">
          <div className="card-body items-center text-center">
            <h2 className="card-title">Passkey App!</h2>
            <div className="card-actions justify-end">
              {authenticated ? (
                <>
                  <div>
                    <Link to={"/profile"} className="btn btn-primary normal-case">
                      Profile
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Link to={"/sign-up"} className="btn btn-primary normal-case">
                      Sign up
                    </Link>
                  </div>
                  <div>
                    <Link to={"/sign-in"} className="btn btn-secondary normal-case">
                      Sign in
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
