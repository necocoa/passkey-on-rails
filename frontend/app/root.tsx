import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import { json, type LinksFunction, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import stylesheet from "~/tailwind.css";
import { authentication } from "./utils/auth.server";
import { Header } from "./compornents/Header";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: stylesheet }];

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { user } = await authentication(request, context);
  return json({ user });
};

export default function App() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="grid bg-base-200" style={{ minHeight: "100lvh", gridTemplateRows: "auto 1fr auto" }}>
          <Header user={user} />
          <main>
            <Outlet />
          </main>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
