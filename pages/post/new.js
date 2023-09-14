import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../../components/AppLayout';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { getAppProps } from '../../utils/getAppProps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain } from '@fortawesome/free-solid-svg-icons';

export default function NewPost(props) {
  const router = useRouter();
  const [keywords, setKeywords] = useState('');
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const response = await fetch(`/api/generatePost`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ topic, keywords }),
      });
      const json = await response.json();
      console.log('RESULT', json);
      if (json?.postId) {
        router.push(`/post/${json.postId}`);
      }
    } catch (error) {
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
                <strong>Generate a blog post on topic of:</strong>
              </label>
              <textarea
                className="resize-none border border-slate-500  block my-2 px-4 py-2 rounded-sm w-full"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                maxLength={80}
              />
            </div>
            <div>
              <label htmlFor="">
                <strong>Targeting the following keywords:</strong>
              </label>
              <textarea
                className="resize-none border border-slate-500  block my-2 px-4 py-2 rounded-sm w-full"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                maxLength={80}
              />
              <small className="mb-2 block">
                separate keywords with a comma
              </small>
            </div>
            <button
              type="submit"
              className="btn"
              disabled={!topic.trim() || !keywords.trim()}
            >
              Generate
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);

    if (!props.availableTokens) {
      return {
        redirect: {
          destination: '/token-topup',
          permanent: false,
        },
      };
    }

    return {
      props,
    };
  },
});
