import { createContext, useCallback, useReducer, useState } from "react";

type postProp = {
  setPostsFromSSR?: (postsFromSSR: any[]) => void;
  posts?: any[];
  getPosts?: (lastPostDate: any, getNewPosts?: boolean) => void;
  noMorePosts?: boolean;
  deletePost?: (postId: string) => void;
};

const PostsContext = createContext<postProp>({});
export default PostsContext;

type postsAction = {
  type: string;
  posts?: any[];
  postId?: string;
};

function postsReducer(state: any[], action: postsAction) {
  switch (action.type) {
    case "addPoints": {
      const newPosts = [...state];
      action.posts.forEach((post) => {
        const exists = newPosts.find((p) => p._id === post._id);
        if (!exists) {
          newPosts.push(post);
        }
      });
      return newPosts;
    }
    case "deletePost": {
      const newPosts = [];
      state.forEach((post) => {
        if (post._id !== action.postId) {
          newPosts.push(post);
        }
      });
      return newPosts;
    }
    default:
      return state;
  }
}

export const PostsProvider = ({ children }) => {
  const [posts, dispatch] = useReducer(postsReducer, []);
  const [noMorePosts, setNoMorePosts] = useState(false);

  const setPostsFromSSR = useCallback((postsFromSSR = []) => {
    dispatch({
      type: "addPosts",
      posts: postsFromSSR,
    });
  }, []);

  const getPosts = useCallback(
    async ({ lastPostDate, getNewPosts = false }) => {
      const result = await fetch(`/api/getPosts`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ lastPostDate, getNewPosts }),
      });
      const json = await result.json();
      const postsResult: any[] = json.posts || [];

      if (postsResult.length < 5) {
        setNoMorePosts(true);
      }
      dispatch({
        type: "addPosts",
        posts: postsResult,
      });
    },
    []
  );

  const deletePost = useCallback((postId) => {
    dispatch({
      type: "deletePost",
      postId,
    });
  }, []);

  return (
    <PostsContext.Provider
      value={{ posts, setPostsFromSSR, getPosts, noMorePosts, deletePost }}
    >
      {children}
    </PostsContext.Provider>
  );
};
