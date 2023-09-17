import { useUser } from "@auth0/nextjs-auth0/client";
import { Logo } from "../Logo";
import Link from "next/link";
import { ReactElement, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { AppProps } from "next/app";

type appProp = {
  children: React.ReactNode;
  availableTokens?: string;
  posts?: any[];
  postId?: string;
};

export const AppLayout = ({
  children,
  availableTokens,
  posts,
  postId,
}: appProp) => {
  const { user } = useUser();
  const [modal, setModal] = useState(false);

  const handleClick = () => {
    setModal(!modal);
  };

  return (
    <div className="grid grid-cols-1 h-screen sm:grid-cols-[300px_1fr] overflow-hidden">
      <div
        className={`flex flex-col transition-[height] ease-in-out text-white sm:h-screen ${
          modal ? "h-screen" : "h-20"
        } overflow-hidden`}
      >
        <div className="bg-slate-800 px-2">
          <div onClick={handleClick}>
            <Logo />
          </div>
          <Link href="/post/new" className="btn">
            New Post
          </Link>
          <Link href="/token-topup" className="block mt-2 text-center">
            <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
            <span className="pl-1">{availableTokens} tokens available</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
          {posts?.map((post) => (
            <Link
              key={post._id}
              href={`/post/${post._id}`}
              className={`py-1 border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap my-1 px-2 bg-white/10 cursor-pointer rounded-sm ${
                postId === post._id ? "bg-white/20 border-white" : ""
              }`}
            >
              {post.topic}
            </Link>
          ))}
        </div>
        <div className="bg-cyan-800 flex items-center gap-2 border-t border-t-black/50 h-20 px-2">
          {" "}
          {user ? (
            <>
              <div>
                <Image
                  src={user.picture || ""}
                  alt={user.name || ""}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1">
                <div>{user.email}</div>
                <Link className="text-sm" href="/api/auth/logout">
                  Logout
                </Link>
              </div>
            </>
          ) : (
            <Link href="/api/auth/login">Login</Link>
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};
