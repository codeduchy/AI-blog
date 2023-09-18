import { AppProps } from "next/app";
import { Dispatch, createContext, useCallback, useState } from "react";

interface Post {
  _id: string;
}

const PostsContext = createContext({});

const postContext = ({
  children,
}: AppProps & { children: React.ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [noMorePosts, setNoMorePosts] = useState(false);

  const setPostsFromSSR = useCallback((postsFromSSR: Post[]) => {
    setPosts((value) => {
      const newPosts = [...value];
      postsFromSSR.forEach((post) => {
        const exists = newPosts.find((p) => p._id === post._id);
        if (!exists) {
          newPosts.push(post);
        }
      });
      return newPosts;
    });
  }, []);

  const getPosts = useCallback(
    async ({
      lastPostDate,
      getNewerPosts = false,
    }: {
      lastPostDate: string;
      getNewerPosts: boolean;
    }) => {
      const result = await fetch("/api/getPosts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lastPostDate, getNewerPosts }),
      });
      const json = await result.json();
      const postsResult: Post[] = json.posts || [];

      if (postsResult.length < 5) {
        setNoMorePosts(true);
      }

      setPosts((value) => {
        const newPosts = [...value];
        postsResult.forEach((post) => {
          const exists = newPosts.find((p) => p._id === post._id);
          if (!exists) {
            newPosts.push(post);
          }
        });
        return newPosts;
      });
    },
    []
  );

  return (
    <PostsContext.Provider
      value={{ posts, setPostsFromSSR, getPosts, noMorePosts }}
    >
      {children}
    </PostsContext.Provider>
  );
};
export default postContext;
