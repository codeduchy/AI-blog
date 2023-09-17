import { AppLayout } from "../components/AppLayout";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { AppProps } from "next/app";
import { ReactElement } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

const TokenTopup = ({ data }: { data: string }) => {
  return (
    <div>
      <h1>token topup</h1>
    </div>
  );
};

TokenTopup.getLayout = (page: ReactElement, pageProps: AppProps) => {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    return {
      props: {},
    };
  },
});

export default TokenTopup;
