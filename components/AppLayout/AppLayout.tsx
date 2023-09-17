import { useUser } from "@auth0/nextjs-auth0/client";
import { Logo } from "../Logo";
import Link from "next/link";
import { NextPage } from "next";
import { ReactElement } from "react";

export const AppLayout = ({ children }: { children: ReactElement }) => {
  const { user } = useUser();

  return (
    <div>
      <div>
        <div>
          <Logo />
          <Link href="/post/new" className="btn">
            New Post
          </Link>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};
