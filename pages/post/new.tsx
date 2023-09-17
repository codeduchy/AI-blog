import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import { AppProps } from "next/app";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useRef, MutableRefObject } from "react";
import { getAppProps } from "../../utils/getAppProps";

const NewPost = (props: AppProps) => {
  const router = useRouter();
  const topicRef: MutableRefObject<HTMLTextAreaElement | null> = useRef(null);
  const keywordsRef: MutableRefObject<HTMLTextAreaElement | null> =
    useRef(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const topic = topicRef?.current?.value;
    const keywords = keywordsRef?.current?.value;

    if (!topic?.trim() || !keywords?.trim()) {
      console.log("no topic and/or keywords");
    }

    const response = await fetch(`/api/generatePost`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ topic, keywords }),
    });
    const json = await response.json();
    console.log("[NewPost]: ", json);

    if (json?.postId) router.push(`/post/${json.postId}`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="">
            <strong>Generate a blog post topic of:</strong>
          </label>
          <textarea
            className="resize-none border border-slate-500 block my-2 px-4 py-2 rounded-sm w-full"
            ref={topicRef}
          ></textarea>
        </div>
        <div>
          <label htmlFor="">
            <strong>Targeting the following keywords:</strong>
          </label>
          <textarea
            className="resize-none border border-slate-500 block my-2 px-4 py-2 rounded-sm w-full"
            ref={keywordsRef}
          ></textarea>
        </div>
        <button type="submit" className="btn">
          Generate
        </button>
      </form>
    </div>
  );
};

NewPost.getLayout = function getLayout(
  page: React.ReactElement,
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

export default NewPost;
