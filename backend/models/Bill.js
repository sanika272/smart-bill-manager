
const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  frequency: {
  type: String,
  enum: ["none", "monthly", "yearly", "custom"],
  default: "none"
},
isRecurring: {
  type: Boolean,
  default: false
},
emailSentToday: {
  type: Boolean,
  default: false
}

});

module.exports = mongoose.model("Bill", billSchema);



