 






// server.js
require("dotenv").config(); // ✅ Load environment variables

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cron = require("node-cron");
const dayjs = require("dayjs");

// Routes
const userRoutes = require("./routes/userRoutes");
const billRoutes = require("./routes/Bills");

// Utils
const checkDueTodayEmails = require("./utils/emailscheduler");
require("./utils/recurringBills"); // recurring bills cron job

const app = express();

// ✅ Middleware
app.use(cors()); // Allow frontend requests
app.use(express.json()); // Parse JSON requests

// ✅ Root route for Render test & sanity check
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Use routes
app.use("/api/users", userRoutes);
app.use("/api/bills", billRoutes);

// ✅ Daily email scheduler at 9 AM
cron.schedule("0 9 * * *", () => {
  console.log("Running daily email check...");
  checkDueTodayEmails();
});

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ✅ PORT for Render (Render injects process.env.PORT)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));