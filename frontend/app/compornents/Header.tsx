import { Form, Link } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/cloudflare";
import type { AuthUser } from "~/utils/auth";

type Props = {
  user: SerializeFrom<AuthUser> | null;
};

export function Header({ user }: Props) {
  return (
    <header className="navbar bg-base-100">
      <div className="flex-1">
        <Link to={"/"} className="btn btn-ghost text-xl normal-case">
          Passkey App
        </Link>
      </div>
      {user && (
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost normal-case">
              {user.username}
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content rounded-box menu-sm z-10 mt-3 w-52 bg-base-100 p-2 shadow"
            >
              <li>
                <Link to={"/profile"}>Profile</Link>
              </li>
              <li>
                <Form method="post" action="/session/destroy">
                  <button type="submit">Logout</button>
                </Form>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
