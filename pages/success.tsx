import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";
import { getAppProps } from "../utils/getAppProps";
import { ReactElement } from "react";
import { AppProps } from "next/app";
import { GetServerSideProps } from "next";

export default function Success() {
  return (
    <div>
      <h1>Thank you for your purchase</h1>
    </div>
  );
}

Success.getLayout = function getLayout(
  page: ReactElement,
  pageProps: AppProps
) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props,
    };
  },
});
