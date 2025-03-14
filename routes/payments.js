const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
require("dotenv").config();
const authMiddleware = require("../middlewares/auth");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Ruta para crear un cliente en Stripe
router.post("/create-customer", async (req, res) => {
  try {
    const { email, name } = req.body;
    
    const customer = await stripe.customers.create({
      email,
      name,
    });

    res.json({ customerId: customer.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para asociar un método de pago SEPA a un cliente
router.post("/attach-sepa", async (req, res) => {
    try {
      const { customerId, iban } = req.body;
  
      // Crear método de pago SEPA
      const paymentMethod = await stripe.paymentMethods.create({
        type: "sepa_debit",
        sepa_debit: { iban },
        billing_details: { name: "Cliente SEPA" },
      });
  
      // Asociar el método de pago al cliente
      await stripe.paymentMethods.attach(paymentMethod.id, { customer: customerId });
  
      res.json({ paymentMethodId: paymentMethod.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Ruta para confirmar mandato SEPA
router.post("/confirm-mandate", async (req, res) => {
    try {
      const { paymentMethodId, customerId } = req.body;
  
      // Crear un Intent de Setup para generar el mandato
      const setupIntent = await stripe.setupIntents.create({
        payment_method: paymentMethodId,
        customer: customerId,
        confirm: true,
      });
  
      res.json({ setupIntentId: setupIntent.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Ruta para crear un pago SEPA recurrente
router.post("/charge-sepa", async (req, res) => {
    try {
      const { customerId, amount, currency } = req.body;
  
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convertir a centavos
        currency,
        customer: customerId,
        payment_method_types: ["sepa_debit"],
        confirm: true,
      });
  
      res.json({ paymentIntentId: paymentIntent.id, status: paymentIntent.status });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
module.exports = router;
