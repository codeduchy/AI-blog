// import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components";
import { AppInitialProps, AppProps } from "next/app";
import { getAppProps } from "../../utils/getAppProps";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

const NewPost = (props: AppProps) => {
  const { user } = useUser();
  const [isUser, setIsUser] = useState(null);
  useEffect(() => {
    if (user) {
      setIsUser(true);
    } else {
      setIsUser(false);
    }
  }, [user]);
  const router = useRouter();
  const [error, setError] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    if (!keywords.trim() || !topic.trim()) {
      setError(true);
      return;
    }
    setGenerating(true);

    const response = await fetch("/api/generatePost", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ keywords, topic }),
    });
    const json = await response.json();

    if (json?.postId) {
      router.push(`/post/${json.postId}`);
    } else {
      setGenerating(false);
      setError(true);
    }
  };

  if (!isUser)
    return (
      <div className="relative px-4 w-11/12 max-w-screen-sm mx-auto -mt-40 sm:mt-10 h-full max-w-screen-sm overflow-hidden">
        <h4 className="text-center">
          You need to Login in order to generate a blog
        </h4>
        <Link href="/api/auth/login" className="btn text-white">
          Login
        </Link>
      </div>
    );

  return (
    <div className="relative px-4 w-11/12 max-w-screen-sm mx-auto h-full overflow-hidden -mt-20 sm:mt-0">
      {generating && (
        <div className="text-green-500 flex flex-col h-full animate-pulse justify-center items-center">
          <FontAwesomeIcon icon={faBrain} className="text-8xl" />
          <h6 className="ml-1.5">Generating...</h6>
        </div>
      )}
      {!generating && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:mt-16">
          <div>
            <label htmlFor="">
              <strong>Generate a blog post on topic of:</strong>
            </label>
            <textarea
              className="resize-none border border-slate-400 block my-2 px-4 py-4 rounded-md w-full"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label htmlFor="">
              <strong>Targeting the following keywords:</strong>
            </label>
            <textarea
              className="resize-none border border-slate-400 block my-2 px-4 py-4 rounded-md w-full"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            ></textarea>
          </div>
          <button
            type="submit"
            className="btn py-6 text-white"
            disabled={
              topic.trim().length < 2 ||
              topic.length > 100 ||
              keywords.trim().length < 2 ||
              keywords.length > 100
            }
          >
            Generate
          </button>
        </form>
      )}
      {error ? (
        <div className=" text-red-500 font-bold text-center bg-red-100 py-6 mt-6 rounded-md w-full">
          Something went wrong, try again later...
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
export default NewPost;

NewPost.getLayout = (page: React.ReactElement, pageProps: AppInitialProps) => {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = async function getServerSideProps(ctx) {
  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const props = await getAppProps(ctx);
  return {
    props,
  };
};
