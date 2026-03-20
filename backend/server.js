//  require("dotenv").config();
//  const cron = require("node-cron");
// const checkDueTodayEmails = require("./utils/emailscheduler");

// console.log("JWT SECRET:", process.env.JWT_SECRET);
// console.log("SERVER FILE LOADED");
// require("./utils/emailscheduler");

// const express = require("express");

// const cors = require("cors");
// const mongoose = require("mongoose");

// cron.schedule("0  9 * * *", () => {
//   console.log("Running daily email check...");
//   checkDueTodayEmails();
// });

//  const app = express();

// app.use(cors());
// app.use(express.json());

// console.log("JWT_SECRET is:", process.env.JWT_SECRET);

// const userRoutes = require("./routes/userRoutes");
// const billRoutes = require("./routes/Bills");

// app.use("/api/users", userRoutes);
// app.use("/api/bills", billRoutes);

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => console.error("Mongo error:", err));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// require("dotenv").config();
//  const cron = require("node-cron");
// const checkDueTodayEmails = require("./utils/emailscheduler");

// console.log("JWT SECRET:", process.env.JWT_SECRET);
// console.log("SERVER FILE LOADED");
// require("./utils/emailscheduler");

// const express = require("express");

// const cors = require("cors");
// const mongoose = require("mongoose");
// const dayjs = require("dayjs");
// const Bill = require("./models/Bill");

// cron.schedule("0  9 * * *", () => {
//   console.log("Running daily email check...");
//   checkDueTodayEmails();
// });

// cron.schedule("* * * * *", async () => {
//   console.log("Running recurring bill job...");

//   const today = dayjs().startOf("day");

//   try {
//     const bills = await Bill.find({ isRecurring: true });

//     for (let bill of bills) {
//       const dueDate = dayjs(bill.dueDate);

//       const isDueToday = dueDate.isSame(today, "day");

//       const alreadyGenerated =
//         bill.lastGeneratedDate &&
//         dayjs(bill.lastGeneratedDate).isSame(today, "day");

//       if (isDueToday && !alreadyGenerated) {
//         let newDueDate;

//         if (bill.frequency === "monthly") {
//           newDueDate = dueDate.add(1, "month");
//         } else if (bill.frequency === "yearly") {
//           newDueDate = dueDate.add(1, "year");
//         } else {
//           continue;
//         }

//         await Bill.create({
//           category: bill.category,
//           amount: bill.amount,
//           dueDate: newDueDate.toDate(),
//           isRecurring: true,
//           frequency: bill.frequency,
//         });

//         bill.lastGeneratedDate = today.toDate();
//         await bill.save();

//         console.log("✅ Recurring bill created");
//       }
//     }
//   } catch (err) {
//     console.error(err);
//   }
// });
//  const app = express();

// app.use(cors());
// app.use(express.json());

// console.log("JWT_SECRET is:", process.env.JWT_SECRET);

// const userRoutes = require("./routes/userRoutes");
// const billRoutes = require("./routes/Bills");

// app.use("/api/users", userRoutes);
// app.use("/api/bills", billRoutes);

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => console.error("Mongo error:", err));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




// require("dotenv").config();
// const cron = require("node-cron");
// const checkDueTodayEmails = require("./utils/emailscheduler");
// require("./utils/recurringBills");
// console.log("JWT SECRET:", process.env.JWT_SECRET);
// console.log("SERVER FILE LOADED");
// require("./utils/emailscheduler");

// const express = require("express");

// const cors = require("cors");
// const mongoose = require("mongoose");
// const dayjs = require("dayjs");
// const Bill = require("./models/Bill");

// cron.schedule("0  9 * * *", () => {
//   console.log("Running daily email check...");
//   checkDueTodayEmails();
// });

// cron.schedule("0 0 * * *", async () => {
//   console.log("Running recurring bill job...");

//   const today = dayjs().startOf("day");

//   try {
//     const bills = await Bill.find({ isRecurring: true });

//     for (let bill of bills) {
//       const dueDate = dayjs(bill.dueDate);

//       const isDueToday = dueDate.isSame(today, "day");

//       const alreadyGenerated =
//         bill.lastGeneratedDate &&
//         dayjs(bill.lastGeneratedDate).isSame(today, "day");

//       if (isDueToday && !alreadyGenerated) {
//         let newDueDate;

//         if (bill.frequency === "monthly") {
//           newDueDate = dueDate.add(1, "month");
//         } else if (bill.frequency === "yearly") {
//           newDueDate = dueDate.add(1, "year");
//         } else {
//           continue;
//         }

//         await Bill.create({
//           category: bill.category,
//           amount: bill.amount,
//           dueDate: newDueDate.toDate(),
//           isRecurring: true,
//           frequency: bill.frequency,
//           user: bill.user, // ✅ add this line
//         });

//         bill.lastGeneratedDate = today.toDate();
//         await bill.save();

//         console.log("✅ Recurring bill created");
//       }
//     }
//   } catch (err) {
//     console.error(err);
//   }
// });
// const app = express();

// app.use(cors());
// app.use(express.json());

// console.log("JWT_SECRET is:", process.env.JWT_SECRET);

// const userRoutes = require("./routes/userRoutes");
// const billRoutes = require("./routes/Bills");

// app.use("/api/users", userRoutes);
// app.use("/api/bills", billRoutes);

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("Mongo error:", err));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));













require("dotenv").config();

const cron = require("node-cron");

// ✅ CHANGE 1: keep ONLY this import (removed duplicate below)
const checkDueTodayEmails = require("./utils/emailscheduler");

require("./utils/recurringBills");

console.log("JWT SECRET:", process.env.JWT_SECRET);
console.log("SERVER FILE LOADED");

// ❌ CHANGE 2: REMOVED duplicate line
// require("./utils/emailscheduler");  <-- removed

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dayjs = require("dayjs");
const Bill = require("./models/Bill");


// ✅ CHANGE 3: fixed cron expression (removed extra space)
cron.schedule("0 9 * * *", () => {
  console.log("Running daily email check...");
  checkDueTodayEmails();
});


// recurring bills cron (no change)
cron.schedule("0 0 * * *", async () => {
  console.log("Running recurring bill job...");

  const today = dayjs().startOf("day");

  try {
    const bills = await Bill.find({ isRecurring: true });

    for (let bill of bills) {
      const dueDate = dayjs(bill.dueDate);

      const isDueToday = dueDate.isSame(today, "day");

      const alreadyGenerated =
        bill.lastGeneratedDate &&
        dayjs(bill.lastGeneratedDate).isSame(today, "day");

      if (isDueToday && !alreadyGenerated) {
        let newDueDate;

        if (bill.frequency === "monthly") {
          newDueDate = dueDate.add(1, "month");
        } else if (bill.frequency === "yearly") {
          newDueDate = dueDate.add(1, "year");
        } else {
          continue;
        }

        await Bill.create({
          category: bill.category,
          amount: bill.amount,
          dueDate: newDueDate.toDate(),
          isRecurring: true,
          frequency: bill.frequency,
          user: bill.user,
        });

        bill.lastGeneratedDate = today.toDate();
        await bill.save();

        console.log("✅ Recurring bill created");
      }
    }
  } catch (err) {
    console.error(err);
  }
});

const app = express();

app.use(cors());
app.use(express.json());

console.log("JWT_SECRET is:", process.env.JWT_SECRET);


// ✅ CHANGE 4: Added root route (VERY IMPORTANT for Render test)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


const userRoutes = require("./routes/userRoutes");
const billRoutes = require("./routes/Bills");

app.use("/api/users", userRoutes);
app.use("/api/bills", billRoutes);


// MongoDB connection (no change)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));


// PORT (already correct ✅)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));