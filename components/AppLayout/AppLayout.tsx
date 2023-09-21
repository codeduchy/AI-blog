import { useUser } from "@auth0/nextjs-auth0/client";
import { Logo } from "../";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { ContextMenu } from "../../context/menuContext";

const AppLayout = ({ children }) => {
  const { user } = useUser();
  const { showMenu, setShowMenu } = useContext(ContextMenu);

  return (
    <div className="grid grid-1 sm:grid-cols-[300px_1fr] h-screen max-h-screen overflow-hidden">
      <div
        className={`flex flex-col sm:h-screen text-white overflow-hidden ${
          showMenu ? "h-screen" : "h-[68px]"
        } transition-all`}
      >
        <div className="bg-slate-800 px-2">
          <div onClick={() => setShowMenu(!showMenu)}>
            <Logo />
          </div>
          <Link href="/post/new" className="btn">
            New Post
          </Link>
          <Link href="/token-topup" className="block mt-2 text-center">
            <FontAwesomeIcon icon={faCoins} className="text-yellow" />
            <span className="pl-1">0 tokens available</span>
          </Link>
        </div>
        <div className="flex-1 bg-gradient-to-b from-slate-800 to-cyan-800 overflow-auto">
          list of posts
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
                <div className="flex-1">
                  <div className="font-bold">{user.email}</div>
                  <Link href="/api/auth/logout" className="text-sm">
                    Logout
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <Link href="/api/auth/login">Login</Link>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
export default AppLayout;
