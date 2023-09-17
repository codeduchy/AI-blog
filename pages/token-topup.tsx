import { AppLayout } from "../components/AppLayout";
import { GetServerSideProps } from "next";
import { AppProps } from "next/app";
import { ReactElement } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { getAppProps } from "../utils/getAppProps";

const TokenTopup = () => {
  const handleClick = async () => {
    const result = await fetch(`/api/addTokens`, {
      method: "POST",
    });

    const json = await result.json();
    console.log("TokenTopup:", json);

    window.location.href = json.session.url;
  };

  return (
    <div>
      <h1>token topup</h1>
      <button className="btn" onClick={handleClick}>
        Add Tokens
      </button>
    </div>
  );
};

TokenTopup.getLayout = (page: ReactElement, pageProps: AppProps) => {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = withPageAuthRequired({
  // async getServerSideProps(ctx) {
  //   const props = await getAppProps(ctx);
  //   return {
  //     props,
  //   };
  // },
});

export default TokenTopup;
