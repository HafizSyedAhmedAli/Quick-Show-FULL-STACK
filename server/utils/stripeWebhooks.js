import Stripe from "stripe";
import Booking from "../models/Booking.js";

// Stripe Webhooks to Verify Payments Action: /stripe
export const stripeWebhooks = async (req, res) => {
  // Stipe Gateway Initialize
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send("Webhook Error:", error.message);
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const sessionList = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntent,
      });

      const session = sessionList.data[0];
      const { bookingId } = session.metadata;

      await Booking.findByIdAndUpdate(bookingId, {
        isPaid: true,
        paymentLink: "",
      });
      break;
    }
    default:
      console.log("Unhandled event type:", event.type);
  }

  res.json({ received: true });
};
