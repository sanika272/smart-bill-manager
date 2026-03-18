const cron = require("node-cron");
const Bill = require("../models/Bill");

// ⏰ Runs every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("🔁 Running recurring bills job...");

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // find recurring bills
    const bills = await Bill.find({ isRecurring: true });

    for (let bill of bills) {
      let nextDate = new Date(bill.dueDate);

      // monthly
      if (bill.frequency === "monthly") {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }

      // yearly
      if (bill.frequency === "yearly") {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      }

      // check if next bill already exists
      const exists = await Bill.findOne({
        user: bill.user,
        category: bill.category,
        dueDate: nextDate,
      });

      if (!exists && nextDate <= today) {
        await Bill.create({
          user: bill.user,
          category: bill.category,
          amount: bill.amount,
          dueDate: nextDate,
          frequency: bill.frequency,
          isRecurring: true,
          paid: false,
        });

        console.log("✅ New recurring bill created");
      }
    }
  } catch (err) {
    console.log("❌ Cron error:", err);
  }
});