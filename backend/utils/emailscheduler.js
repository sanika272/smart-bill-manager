console.log("Email scheduler file loaded");
const Bill = require("../models/Bill");
const User = require("../models/user");
const sendEmail = require("./sendemail");

const checkDueTodayEmails = async () => {
  console.log("Checking due today emails...");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const bills = await Bill.find({ paid: false });

  for (let bill of bills) {
    const due = new Date(bill.dueDate);
    due.setHours(0, 0, 0, 0);

    if (due.getTime() === today.getTime() && !bill.emailSentToday) {

      const user = await User.findById(bill.user);

      await sendEmail(
        user.email,
        "Bill Due Today Reminder",
        `Hello ${user.name}, your bill "${bill.category}" of ₹${bill.amount} is due today.`
      );

      bill.emailSentToday = true;
      await bill.save();
    }
  }
};

module.exports = checkDueTodayEmails;
