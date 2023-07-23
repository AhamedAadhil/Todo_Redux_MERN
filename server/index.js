const express = require("express");
const app = express();
const cors = require("cors");
const dbConfig = require("./config/Db");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const noteRoutes = require("./routes/noteRoutes");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/auth", userRoutes);
app.use("/user", profileRoutes);
app.use("/notes", noteRoutes);

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`App running on ${port}`);
});
