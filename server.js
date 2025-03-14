const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripeRoutes = require("./routes/stripe");
const paymentRoutes = require("./routes/payments");
const paymentsRoutes = require("./routes/payments");
const webhooksRoutes = require("./webhooks/stripeWebhook");
const uploadsRoutes = require("./routes/uploads");
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas
const path = require("path");

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));
app.use("/stripe", stripeRoutes);
app.use("/payments", paymentRoutes);
app.use("/payments", paymentsRoutes);
app.use("/webhooks", webhooksRoutes);
app.use("/uploads", uploadsRoutes);
app.get("/", (req, res) => {
    res.send("API funcionando correctamente");
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
