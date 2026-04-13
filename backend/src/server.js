require("dotenv").config();
const express = require("express");
const cors = require("cors");


const { connectDB } = require("./db");
const authRoutes = require("./routes/auth");
const resumeRoutes = require("./routes/resume");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

const port = process.env.PORT || 4000;

connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, "0.0.0.0", () => console.log(`✅ API running on :${port}`));
  })
  .catch((e) => {
    console.error("❌ DB connection failed:", e);
    process.exit(1);
  });