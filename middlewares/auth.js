require("dotenv").config();

module.exports = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token || token !== `Bearer ${process.env.SECRET_KEY}`) {
    return res.status(403).json({ error: "Acceso no autorizado" });
  }

  next();
};
