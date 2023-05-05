require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/connectDB");
const developerRoutes = require("./routes/developerRoutes");
const employerRoutes = require("./routes/employerRoutes");
connectDB();

app.use(express.json());

app.use("/developer", developerRoutes);
app.use("/employer", employerRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(400).json({ message: "Erreur serveur." });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}.`));
