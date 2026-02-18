 
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    monthlyBudget: { type: Number, default: 8000 },
    budgetMonth: { type: Number, default: null }, // tracks last budget set month
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
