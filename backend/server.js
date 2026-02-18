 require("dotenv").config(); 
 const cron = require("node-cron");
const checkDueTodayEmails = require("./utils/emailscheduler");

console.log("JWT SECRET:", process.env.JWT_SECRET);
console.log("SERVER FILE LOADED");
require("./utils/emailscheduler");

const express = require("express");
 
const cors = require("cors");
const mongoose = require("mongoose");
 
 

cron.schedule("0  9 * * *", () => {
  console.log("Running daily email check...");
  checkDueTodayEmails();
});

 const app = express();

app.use(cors());
app.use(express.json());

console.log("JWT_SECRET is:", process.env.JWT_SECRET);

 
const userRoutes = require("./routes/userRoutes");
const billRoutes = require("./routes/Bills");

app.use("/api/users", userRoutes);
app.use("/api/bills", billRoutes);

 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo error:", err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
