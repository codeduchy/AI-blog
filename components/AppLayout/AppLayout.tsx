import { useUser } from "@auth0/nextjs-auth0/client";
import { Logo } from "../";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Image from "next/image";
import { useContext, useEffect } from "react";
import { ContextMenu } from "../../context/menuContext";
import { AppProps } from "next/app";
import PostsContext from "../../context/postsContext";

type LayoutProps = {
  children: React.ReactElement;
  availableTokens?: number;
  posts?: any[];
  postId?: string;
  postCreated?: string;
};

const AppLayout = ({
  children,
  availableTokens,
  posts: postsFromSSR = [],
  postId,
  postCreated,
}: LayoutProps) => {
  const { user } = useUser();
  const { showMenu, setShowMenu } = useContext(ContextMenu);
  const { setPostsFromSSR, posts, getPosts, noMorePosts } =
    useContext(PostsContext);

  useEffect(() => {
    setPostsFromSSR(postsFromSSR);
    if (postId) {
      const exists = postsFromSSR.find((post) => post._id === postId);
      if (!exists) {
        getPosts({ getNewPosts: true, lastPostDate: postCreated });
      }
    }
  }, [postsFromSSR, setPostsFromSSR, postId, postCreated, getPosts]);

  return (
    <div className="grid sm:grid-cols-[300px_1fr] h-screen max-h-screen overflow-hidden bg-gray-100">
      <div
        className={`flex flex-col sm:h-screen text-white overflow-hidden z-10 ${
          showMenu ? "h-screen" : "h-[68px]"
        } transition-all`}
      >
        <div
          className="bg-slate-800 px-2"
          onClick={() => setShowMenu(!showMenu)}
        >
          <div>
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
        <div className="relative flex-1 bg-gradient-to-b from-slate-800 to-cyan-800 overflow-auto">
          <div
            className="absolute h-full w-full"
            onClick={() => setShowMenu(!showMenu)}
          ></div>
          {posts?.map((post) => (
            <Link
              key={post._id}
              href={`/post/${post._id}`}
              className={`relative z-15 py-1 border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap m-2 px-2 bg-white/10 cursor-pointer rounded-md ${
                postId === post._id ? "bg-white/20 border-white" : ""
              }`}
            >
              {post.topic}
            </Link>
          ))}
          {!noMorePosts && (
            <div
              className={`relative z-10 hover:underline text-sm text-slate-400 text-center cursor-pointer mt-4 ${
                posts.length < 5 && "hidden"
              }`}
              onClick={() =>
                getPosts({ lastPostDate: posts[posts.length - 1].created })
              }
            >
              Load more posts
            </div>
          )}
        </div>
        <div className="bg-cyan-800 flex items-center gap-2 border-t border-t-black/50 h-20 px-2">
          {user ? (
            <>
              <div className="min-w-[50px]">
                <Image
                  src={user.picture}
                  alt={user.name}
                  height={50}
                  width={50}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="font-bold">{user.email}</div>
                <Link href="/api/auth/logout" className="text-sm">
                  Logout
                </Link>
              </div>
            </>
          ) : (
            <Link
              href="/api/auth/login"
              className="font-bold text-2xl w-full text-center"
            >
              Login
            </Link>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
export default AppLayout;
