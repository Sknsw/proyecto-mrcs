# proyecto-mrcs
git clone https://github.com/TU-USUARIO/proyecto-mrcs.git
cd proyecto-mrcs
npm init -y
npm install express dotenv stripe multer cors

proyecto-mrcs/
│── package.json
│── server.js
│── .env
│── routes/
│   ├── payments.js
│   ├── stripe.js
│── public/
│   ├── index.html
│── uploads/
│── webhooks/
│   ├── stripeWebhook.js

node server.js
curl -X POST http://localhost:3000/stripe/create-account


curl -X POST http://localhost:3000/payments/create-customer \
-H "Content-Type: application/json" \
-d '{"email":"cliente@email.com", "name":"Cliente Ejemplo"}'

curl -X POST http://localhost:3000/payments/attach-sepa \
-H "Content-Type: application/json" \
-d '{"customerId":"cus_xxxx", "iban":"DE89370400440532013000"}'

curl -X POST http://localhost:3000/payments/confirm-mandate \
-H "Content-Type: application/json" \
-d '{"paymentMethodId":"pm_xxxx", "customerId":"cus_xxxx"}'

proyecto-mrcs/
│── public/
│   ├── index.html  (Interfaz web)
│   ├── style.css   (Estilos)
│   ├── script.js   (Lógica frontend)


npm install multer

npm install csv-parser


git init
git add .
git commit -m "Versión inicial"
git branch -M main
git remote add origin https://github.com/tu-usuario/proyecto-mrcs.git
git push -u origin main
