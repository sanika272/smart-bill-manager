 
const express = require("express");
const router = express.Router();
const Bill = require("../models/Bill");
const auth = require("../middleware/auth");

 
router.get("/", auth, async (req, res) => {
  try {
    const bills = await Bill.find({ user: req.user.id }).sort({ dueDate: 1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

 
router.post("/", auth, async (req, res) => {
  const { category, amount, dueDate, frequency, isRecurring } = req.body;

  if (!category || !amount || !dueDate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newBill = new Bill({
      user: req.user.id,
      category,
      amount,
      dueDate,
      paid: false,
      frequency: frequency || "none",
      isRecurring: isRecurring || false
    });

    const savedBill = await newBill.save();
    res.status(201).json(savedBill);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

 
router.put("/edit/:id", auth, async (req, res) => {
  const { category, amount, dueDate } = req.body;

  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    if (bill.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    bill.category = category || bill.category;
    bill.amount = amount || bill.amount;
    bill.dueDate = dueDate || bill.dueDate;

    await bill.save();
    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
 
router.delete("/:id", async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.json({ message: "Bill deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting bill" });
  }
});
 
 
router.put("/:id", auth, async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    if (bill.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    bill.paid = req.body.paid;
    await bill.save();

 
    if (bill.paid === true && bill.isRecurring) {
      let nextDate = new Date(bill.dueDate);

      if (bill.frequency === "monthly") {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }

      if (bill.frequency === "yearly") {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      }

      await Bill.create({
        user: bill.user,
        category: bill.category,
        amount: bill.amount,
        dueDate: nextDate,
        frequency: bill.frequency,
        isRecurring: true,
        paid: false
      });
    }

router.delete("/:id", auth, async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    if (bill.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    
    if (!bill.paid) return res.status(400).json({ message: "Only paid bills can be deleted" });

    await Bill.findByIdAndDelete(req.params.id);
    res.json({ message: "Bill deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


 
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const totalPaid = await Bill.aggregate([
      {
        $match: {
          user: bill.user,
          paid: true,
          dueDate: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    const User = require("../models/user");
    const user = await User.findById(req.user.id);
    const monthlyBudget = user.monthlyBudget;

    let budgetWarning = null;

    if (monthlyBudget > 0 && totalPaid.length > 0) {
      if (totalPaid[0].total > monthlyBudget) {
        budgetWarning = `⚠ You crossed your ₹${user.monthlyBudget} monthly budget!`;
      }
    }

    res.json({
      bill,
      budgetWarning
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}); 

module.exports = router;


 