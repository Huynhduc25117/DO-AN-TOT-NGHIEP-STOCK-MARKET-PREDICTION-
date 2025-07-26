// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const stockRoutes = require("./routes/stockRoutes");
const stockNewsRoutes = require("./routes/newsRoutes");
const predictRoutes = require("./routes/predictRoutes");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/news", stockNewsRoutes);
app.use("/api/predict", predictRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));