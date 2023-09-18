import Cors from "micro-cors";
import stripeInit from "stripe";
import verifyStripe from "@webdeveducation/next-verify-stripe";
import clientPromise from "../../../lib/mongodb";
import { NextApiHandler } from "next";
import { RequestHandler } from "next/dist/server/next";

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

if (
  !process.env.STRIPE_SECRET_KEY?.trim() ||
  !process.env.STRIPE_WEBHOOK_SECRET?.trim()
)
  throw new Error(
    "STRIPE_SECRET_KEY and/or STRIPE_WEBHOOK_SECRET doesn't exist"
  );

const stripe = new stripeInit(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    let event;
    try {
      event = await verifyStripe({
        req,
        stripe,
        endpointSecret,
      });
    } catch (error) {
      console.log("[VERIFY STRIPE ERROR]: ", error);
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const client = await clientPromise;
        const db = client.db("BLOGAI");

        const paymentIntent = event.data.object;
        const auth0Id = paymentIntent.metadata.sub;

        const userProfile = db
          .collection("users")
          .updateOne(
            { auth0Id },
            { $inc: { availableTokens: 10 }, $setOnInsert: { auth0Id } },
            { upsert: true }
          );
      }
      default: {
        console.log("UNHANDLED EVENT: ", event.type);
      }
    }
  } else {
    res
      .status(500)
      .json({ msg: "[STRIPE method not POST]: ", method: req.method });
  }
  console.log("[STRIPE CALL]");
  res.status(200).json({ received: true });
};

export default cors(handler as RequestHandler);
