const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
require("dotenv").config();
const authMiddleware = require("../middlewares/auth");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Ruta para crear una cuenta de trabajador en Stripe
router.post("/create-account", async (req, res) => {
  try {
    const account = await stripe.accounts.create({
      type: "standard",
    });

    res.json({ accountId: account.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para generar un enlace de conexión
router.post("/account-link", async (req, res) => {
  try {
    const { accountId } = req.body;

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: "https://tusitio.com/reauth",
      return_url: "https://tusitio.com/success",
      type: "account_onboarding",
    });

    res.json({ url: accountLink.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/list", authMiddleware, async (req, res) => {
  try {
    const paymentIntents = await stripe.paymentIntents.list({ limit: 10 });
    const pagos = paymentIntents.data.map(pago => ({
      id: pago.id,
      customer: pago.customer,
      amount: pago.amount,
      status: pago.status,
    }));
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
