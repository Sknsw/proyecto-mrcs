const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Ruta para recibir eventos de Stripe
router.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    // Manejar eventos importantes
    if (event.type === "payment_intent.succeeded") {
      console.log("Pago SEPA exitoso:", event.data.object);
    } else if (event.type === "payment_intent.payment_failed") {
      console.log("Pago SEPA fallido:", event.data.object);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error en Webhook:", error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

module.exports = router;
