import "../styles/globals.css";
import { DM_Sans, DM_Serif_Display } from "@next/font/google";
import { AppProps } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { NextPage } from "next";
import MenuContext from "../context/menuContext";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { PostsProvider } from "../context/postsContext";
config.autoAddCss = false;

const dmSans = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
});
const dmSerifDisplay = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
});

type LayoutApp = AppProps & {
  Component: {
    getLayout?: (
      page: React.ReactElement,
      pageProps: AppProps
    ) => React.ReactElement;
  };
};

function MyApp({ Component, pageProps }: LayoutApp) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <UserProvider>
      <MenuContext>
        <PostsProvider>
          {getLayout(<Component {...pageProps} />, pageProps)}
        </PostsProvider>
      </MenuContext>
    </UserProvider>
  );
}

export default MyApp;
