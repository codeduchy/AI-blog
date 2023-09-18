import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";
import stripeInit from "stripe";
import { NextApiRequest, NextApiResponse } from "next";

const stripe = new stripeInit(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req, res);
  const user = session ? session.user : null;
  if (!user) {
    res.status(403).json({ msg: "no user" });
    return;
  }

  const lineItems = [
    { price: process.env.STRIPE_PRODUCT_PRICE_ID, quantity: 1 },
  ];

  const protocol =
    process.env.NODE_ENV === "development" ? "http://" : "https://";
  const host = req.headers.host;

  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: `${protocol}${host}/success`,
    payment_intent_data: {
      metadata: {
        sub: user.sub,
      },
    },
    metadata: {
      sub: user.sub,
    },
  });

  console.log("[AddTokens user]: ", user);

  const client = await clientPromise;
  const db = client.db("BLOGAI");

  const userProfile = db.collection("users").updateOne(
    {
      auth0Id: user.sub,
    },
    {
      $inc: {
        availableTokens: 10,
      },
      $setOnInsert: {
        auth0Id: user.sub,
      },
    },
    {
      upsert: true,
    }
  );

  res.status(200).json({ session: checkoutSession });
}
