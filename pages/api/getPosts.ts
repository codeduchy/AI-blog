import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";

export default withApiAuthRequired(async function handler(req, res) {
  try {
    const session = await getSession(req, res);

    let sub;
    if (session) {
      sub = session?.user?.sub;
    } else {
      return res.status(401);
    }
    const client = await clientPromise;
    const db = client.db("BLOGAI");
    const userProfile = await db.collection("users").findOne({ auth0Id: sub });

    const { lastPostDate, getNewerPosts } = req.body;

    const posts = await db
      .collection("posts")
      .find({
        userId: userProfile?._id,
        created: { [getNewerPosts ? "$gte" : "$lt"]: new Date(lastPostDate) },
      })
      .limit(5)
      .sort({ created: -1 })
      .toArray();

    res.status(200).json({ posts });
  } catch (error) {
    console.log(error);
  }
});
