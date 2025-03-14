const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const Stripe = require("stripe");
require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Configuración de almacenamiento para archivos subidos
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, "pagos-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Ruta para subir archivo y procesar pagos
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se subió ningún archivo" });
  }

  const filePath = req.file.path;
  const pagos = [];

  // Leer el archivo CSV
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      pagos.push(row);
    })
    .on("end", async () => {
      try {
        // Procesar cada pago
        const resultados = [];

        for (const pago of pagos) {
          const { customerId, amount, currency } = pago;

          const paymentIntent = await stripe.paymentIntents.create({
            amount: parseInt(amount) * 100, // Convertir a centavos
            currency,
            customer: customerId,
            payment_method_types: ["sepa_debit"],
            confirm: true,
          });

          resultados.push({
            customerId,
            amount,
            currency,
            paymentIntentId: paymentIntent.id,
            status: paymentIntent.status,
          });
        }

        res.json({ message: "Pagos procesados", results: resultados });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
});

module.exports = router;

