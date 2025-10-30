const express = require("express");
const dotenv = require("dotenv");
const { configDB } = require("./config/db");
const { router } = require("./routes/authRoutes");
const http = require("http").createServer();
const io = require("socket.io")(server);

dotenv.config();
configDB();

const app = express();
app.use(express.json());
app.use("/api/auth", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on Port: ${PORT}`));
