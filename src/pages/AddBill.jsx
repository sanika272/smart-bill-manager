 

 
// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import "./AddBill.css";

// function AddBill() {
//   const [category, setCategory] = useState("");
//   const [amount, setAmount] = useState("");
//   const [dueDate, setDueDate] = useState("");
//   const [isRecurring, setIsRecurring] = useState(false);
//   const [frequency, setFrequency] = useState("monthly");

//   const { id } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (id) {
//       fetchBill();
//     }
//   }, [id]);

//   const fetchBill = async () => {
//     const token = localStorage.getItem("token");

//     const res = await fetch("/api/bills", {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const data = await res.json();
//     const bill = data.find((b) => b._id === id);

//     if (bill) {
//       setCategory(bill.category);
//       setAmount(bill.amount);
//       setDueDate(bill.dueDate.split("T")[0]);
//       setIsRecurring(bill.isRecurring || false);
//       setFrequency(bill.frequency || "monthly");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");

//     const billData = {
//       category,
//       amount,
//       dueDate,
//       isRecurring,
//       frequency: isRecurring ? frequency : "none",
//     };

//     if (id) {
//       await fetch(`/api/bills/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(billData),
//       });
//     } else {
//       await fetch("/api/bills", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(billData),
//       });
//     }

//     navigate("/bills");
//   };

//   return (
//     <div className="addbill-page">
//       <div className="addbill-box">
//         <h2>{id ? "Edit Bill" : "Add New Bill"}</h2>

//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             placeholder="Category"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             required
//           />

//           <input
//             type="number"
//             placeholder="Amount"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             required
//           />

//           <input
//             type="date"
//             value={dueDate}
//             onChange={(e) => setDueDate(e.target.value)}
//             required
//           />

//           {/* 🔥 Recurring Section */}
//           <div className="recurring-section">
//             <label className="recurring-label">
//               <input
//                 type="checkbox"
//                 checked={isRecurring}
//                 onChange={(e) => setIsRecurring(e.target.checked)}
//               />
//               Recurring Bill
//             </label>

//             {isRecurring && (
//               <select
//                 value={frequency}
//                 onChange={(e) => setFrequency(e.target.value)}
//               >
//                 <option value="monthly">Monthly</option>
//                 <option value="yearly">Yearly</option>
//               </select>
//             )}
//           </div>

//           <button type="submit">
//             {id ? "Update Bill" : "Add Bill"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddBill;






const BASE_URL = "https://smart-bill-manager-1.onrender.com";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AddBill.css";

function AddBill() {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("monthly");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Token check inside useEffect to prevent crashes
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (id) {
      fetchBill();
    }
    // eslint-disable-next-line
  }, [id]);

  const fetchBill = async () => {
    const token = localStorage.getItem("token");
    if (!token) return; // ✅ Double safety

    try {
      // ✅ Optional: If your backend supports GET /api/bills/:id, use it instead of fetching all
      const res = await fetch(`${BASE_URL}/api/bills`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Check if server responded with error
      if (!res.ok) {
        const errorData = await res.json();
        alert("Error fetching bill: " + (errorData.message || "Server error"));
        return;
      }

      // ✅ Safe parsing of JSON
      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.error("Failed to parse JSON:", err);
        alert("Server error. Please try again.");
        return;
      }

      const bill = data.find((b) => b._id === id);
      if (bill) {
        setCategory(bill.category);
        setAmount(bill.amount);
        setDueDate(bill.dueDate.split("T")[0]);
        setIsRecurring(bill.isRecurring || false);
        setFrequency(bill.frequency || "monthly");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch bill. Check your connection.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // ✅ Token check before submission
    if (!token) {
      alert("Please login again");
      navigate("/login");
      return;
    }

    const billData = {
      category,
      amount,
      dueDate,
      isRecurring,
      frequency: isRecurring ? frequency : "none",
    };

    try {
      const res = await fetch(`${BASE_URL}/api/bills${id ? "/" + id : ""}`, {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(billData),
      });

      // ✅ Check if server returned error
      if (!res.ok) {
        const errData = await res.json();
        alert("Failed to save bill: " + (errData.message || "Server error"));
        return;
      }

      navigate("/bills"); // ✅ Only navigate if success
    } catch (err) {
      console.error(err);
      alert("Server error. Could not save bill.");
    }
  };

  return (
    <div className="addbill-page">
      <div className="addbill-box">
        <h2>{id ? "Edit Bill" : "Add New Bill"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />

          {/* 🔥 Recurring Section */}
          <div className="recurring-section">
            <label className="recurring-label">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
              />
              Recurring Bill
            </label>

            {isRecurring && (
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            )}
          </div>

          <button type="submit">{id ? "Update Bill" : "Add Bill"}</button>
        </form>
      </div>
    </div>
  );
}

export default AddBill;