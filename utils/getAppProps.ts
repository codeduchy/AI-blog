import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../lib/mongodb";
import * as fs from "fs";
import path from "path";

export const getAppProps = async (ctx) => {
  const userSession = await getSession(ctx.req, ctx.res);
  if (!userSession) return { availableTokens: 0, posts: [] };
  const client = await clientPromise;
  const db = client.db("BLOGAI");
  const user = await db.collection("users").findOne({
    auth0Id: userSession.user.sub,
  });

  if (!user && userSession) {
    const configDirectory = path.resolve(process.cwd(), "data");
    const file = JSON.parse(
      fs.readFileSync(
        path.join(configDirectory, "exampleBlogPost.json"),
        "utf8"
      )
    );
    const newUser = await db.collection("users").insertOne({
      auth0Id: userSession.user.sub,
      availableTokens: 5,
      createdAt: new Date(),
    });
    const NewPost = await db.collection("posts").insertOne({
      postContent: file.postContent,
      title: file.title,
      metaDescription: file.metaDescription,
      topic: file.topic,
      keywords: file.keywords,
      userId: newUser.insertedId,
      created: new Date(),
    });

    const post = await db.collection("posts").findOne({
      _id: NewPost.insertedId,
    });

    return {
      availableTokens: 5,
      posts: [
        {
          _id: post._id.toString(),
          postContent: post.postContent,
          title: post.title,
          metaDescription: post.metaDescription,
          topic: post.topic,
          keywords: post.keywords,
          created: post.created.toString(),
        },
      ],
      postId: ctx.params?.postId || null,
    };
  }

  if (!user) {
    return {
      availableTokens: 0,
      posts: [],
    };
  }

  const posts = await db
    .collection("posts")
    .find({
      userId: user._id,
    })
    .sort({
      created: -1,
    })
    .toArray();

  return {
    availableTokens: user.availableTokens,
    posts: posts.map(({ created, _id, userId, ...rest }) => ({
      _id: _id.toString(),
      created: created.toString(),
      ...rest,
    })),
    postId: ctx.params?.postId || null,
  };
};
