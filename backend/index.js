const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { configDB } = require("./config/db");
const { router } = require("./routes/authRoutes");
const http = require("http").createServer();

dotenv.config();
configDB();

const corsOrigin = {
  origin: "http://localhost:3000",
};

const app = express();
app.use(express.json());
app.use(cors(corsOrigin));
app.use("/api/auth", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on Port: ${PORT}`));
