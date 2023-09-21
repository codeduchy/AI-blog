import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components";
import { AppInitialProps, AppProps } from "next/app";

const NewPost = (props: AppProps) => {
  return <div>NewPost</div>;
};
export default NewPost;

NewPost.getLayout = (page: React.ReactElement, pageProps: AppInitialProps) => {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps() {
    return {
      props: {},
    };
  },
});
