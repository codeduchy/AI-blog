import AppLayout from "../components/AppLayout/AppLayout";
import type { AppInitialProps } from "next/app";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

const TokenPopup = () => {
  return <div>TokenPopup</div>;
};

TokenPopup.getLayout = (
  page: React.ReactElement,
  pageProps: AppInitialProps
) => {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps() {
    return {
      props: {},
    };
  },
});

export default TokenPopup;
