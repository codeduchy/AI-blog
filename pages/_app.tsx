import "../styles/globals.css";
import { AppProps } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { DM_Sans, DM_Serif_Display } from "@next/font/google";

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

type Page /* <P = {}> = NextPage<P> & */ = {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

function MyApp({ Component, pageProps }: AppProps & { Component: Page }) {
  const getLayout = Component.getLayout || ((page: React.ReactNode) => page);
  return (
    <UserProvider>
      <main
        className={`${dmSans.variable} ${dmSerifDisplay.variable} font-body`}
      >
        {getLayout(<Component {...pageProps} />)}
      </main>
    </UserProvider>
  );
}

export default MyApp;
