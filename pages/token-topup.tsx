import AppLayout from "../components/AppLayout/AppLayout";
import type { AppInitialProps } from "next/app";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { getAppProps } from "../utils/getAppProps";

const TokenPopup = () => {
  const handleClick = async () => {
    const result = await fetch(`/api/addTokens`, {
      method: "POST",
    });
    const json = await result.json();
    window.location.href = json.session.url;
  };

  return (
    <div className="justify-center text-center mx-auto sm:mt-20 -mt-40 rounded-md">
      <h1>Topup Tokens</h1>
      <button
        className="btn min-w-[340px] p-8 text-2xl text-white"
        onClick={handleClick}
      >
        BUY tokens
      </button>
    </div>
  );
};

TokenPopup.getLayout = (
  page: React.ReactElement,
  pageProps: AppInitialProps
) => {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props,
    };
  },
});

export default TokenPopup;
