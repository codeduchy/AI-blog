import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { GetServerSideProps } from "next";

const Post = () => {
  return (
    <div>
      <h1>Post page</h1>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = withPageAuthRequired({
  async getServerSideProps() {
    return {
      props: {},
    };
  },
});

export default Post;
