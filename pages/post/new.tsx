import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import { AppProps } from "next/app";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useRef, MutableRefObject, useState } from "react";
import { getAppProps } from "../../utils/getAppProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";

const NewPost = (props: AppProps) => {
  const router = useRouter();
  const topicRef: MutableRefObject<HTMLTextAreaElement | null> = useRef(null);
  const keywordsRef: MutableRefObject<HTMLTextAreaElement | null> =
    useRef(null);
  const [generating, setGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGenerating(true);
    const topic = topicRef?.current?.value;
    const keywords = keywordsRef?.current?.value;

    if (!topic?.trim() || !keywords?.trim()) {
      window.alert("no topic and/or keywords");
      setGenerating(false);
      return;
    }

    try {
      const response = await fetch(`/api/generatePost`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ topic, keywords }),
      });
      if (!response.ok) throw new Error("openai fetch error");

      const json = await response.json();
      console.log("[NewPost]: ", json);

      if (json?.postId) router.push(`/post/${json.postId}`);
    } catch (error) {
      console.log(error);

      setGenerating(false);
    }
  };

  return (
    <div className="h-full overflow-hidden">
      {generating && (
        <div className="text-green-500 flex flex-col h-full animate-pulse justify-center items-center">
          <FontAwesomeIcon icon={faBrain} className="text-8xl" />
          <h6 className="ml-1.5">Generating...</h6>
        </div>
      )}
      {!generating && (
        <div className="w-full h-full flex flex-col px-2">
          <form
            onSubmit={handleSubmit}
            className="m-auto max-w-screen-sm w-full bg-slate-100 p-4 rounded-md shadow-xl border-slate-200 shadow-slate-200"
          >
            <div>
              <label htmlFor="">
                <strong>Generate a blog post topic of:</strong>
              </label>
              <textarea
                className="resize-none border border-slate-500 block my-2 px-4 py-2 rounded-sm w-full"
                ref={topicRef}
                maxLength={80}
              ></textarea>
            </div>
            <div>
              <label htmlFor="">
                <strong>Targeting the following keywords:</strong>
              </label>
              <textarea
                className="resize-none border border-slate-500 block my-2 px-4 py-2 rounded-sm w-full"
                ref={keywordsRef}
                maxLength={80}
              ></textarea>
              <small className="mb-2 block">
                seperate keywords with a coma
              </small>
            </div>
            <button type="submit" className="btn">
              Generate
            </button>
          </form>
        </div>
      )}
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
    if (!props.availableTokens) {
      return {
        redirect: {
          destination: "/token-topup",
          permanent: false,
        },
      };
    }
    return {
      props,
    };
  },
});

export default NewPost;
