
// import { useEffect, useState } from "react";
// import "./Bills.css";

// function Bills() {
//   const [bills, setBills] = useState([]);
//   const [editingBill, setEditingBill] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [formData, setFormData] = useState({
//     category: "",
//     amount: "",
//     dueDate: "",
//   });

//   useEffect(() => {
//     fetchBills();
//   }, []);

//   const fetchBills = async () => {
//     const token = localStorage.getItem("token");

//     const res = await fetch("/api/bills", {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const data = await res.json();
//     setBills(data);
//   };

//   const markAsPaid = async (id) => {
//     const token = localStorage.getItem("token");

//     const res = await fetch(`/api/bills/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ paid: true }),
      
//     });

//     const data = await res.json();

   
//     if (data.budgetWarning) {
//       alert(data.budgetWarning);
//     }

//     fetchBills();
//   };

//   const startEdit = (bill) => {
//     setEditingBill(bill._id);
//     setFormData({
//       category: bill.category,
//       amount: bill.amount,
//       dueDate: bill.dueDate.split("T")[0],
//     });
//   };

//   const handleEdit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");

//     await fetch(`/api/bills/edit/${editingBill}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(formData),
//     });

//     setEditingBill(null);
//     fetchBills();
//   };

//   const isOverdue = (dueDate, paid) => {
//   if (paid) return false;

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const due = new Date(dueDate);
//   due.setHours(0, 0, 0, 0);

//   return today > due;
// };

//    const filteredBills = bills.filter((bill) => {
//   const search = searchTerm.toLowerCase();

//   return (
//     bill.category.toLowerCase().includes(search) ||
//     bill.amount.toString().includes(search) ||
//     (bill.paid ? "paid" : "unpaid").includes(search) ||
//     new Date(bill.dueDate).toLocaleDateString().includes(search)
//   );
// });


//   return (
//     <div className="bills-page">
//       <h2>Your Bills</h2>

//       <input
//         type="text"
//         placeholder="Search"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="search-input"
//       />

//       {filteredBills.map((bill) => (
//         <div key={bill._id} className="bill-card">
//           {editingBill === bill._id ? (
//             <form onSubmit={handleEdit}>
//               <input
//                 type="text"
//                 value={formData.category}
//                 onChange={(e) =>
//                   setFormData({ ...formData, category: e.target.value })
//                 }
//                 required
//               />

//               <input
//                 type="number"
//                 value={formData.amount}
//                 onChange={(e) =>
//                   setFormData({ ...formData, amount: e.target.value })
//                 }
//                 required
//               />

//               <input
//                 type="date"
//                 value={formData.dueDate}
//                 onChange={(e) =>
//                   setFormData({ ...formData, dueDate: e.target.value })
//                 }
//                 required
//               />

//               <button type="submit">Save</button>
//               <button onClick={() => setEditingBill(null)}>Cancel</button>
//             </form>
//           ) : (
//             <>
//               <h3>{bill.category}</h3>
//               <p>Amount: ₹{bill.amount}</p>
//               <p>Due Date: {new Date(bill.dueDate).toLocaleDateString()}</p>
//               <p>Status: {bill.paid ? "Paid ✅" : "Unpaid "}</p>

//               {isOverdue(bill.dueDate, bill.paid) && (
//                 <p className="overdue">⚠ Overdue!</p>
//               )}

//               {!bill.paid && (
//                 <button onClick={() => markAsPaid(bill._id)}>
//                   Mark as Paid
//                 </button>
//               )}

//               <button onClick={() => startEdit(bill)}>Edit</button>
//             </>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default Bills;



















// import { useEffect, useState } from "react";
// import "./Bills.css";

// function Bills() {
//   const [bills, setBills] = useState([]);
//   const [editingBill, setEditingBill] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [formData, setFormData] = useState({
//     category: "",
//     amount: "",
//     dueDate: "",
//   });

//   useEffect(() => {
//     fetchBills();
//   }, []);

// const fetchBills = async () => {
//   try {
//     const token = localStorage.getItem("token");

//     const res = await fetch("/api/bills", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const data = await res.json();
//     console.log("BILLS:", data);

//     setBills(data);
//   } catch (err) {
//     console.error(err);
//   }
// };
// const markAsPaid = async (id) => {
//   try {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       alert("Please login again");
//       return;
//     }

//     // 👉 Use API URL if available, else fallback to local
     
//     const res = await fetch(`/api/bills/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ paid: true }),
//     });

//     const data = await res.json(); // ✅ MUST be here

//     if (!res.ok) {
//       console.log("Error:", data);
//       alert("Failed: " + data.message);
//       return;
//     }

//     // ✅ Update UI instantly
//     setBills((prevBills) =>
//       prevBills.map((bill) =>
//         bill._id === id ? { ...bill, paid: true } : bill
//       )
//     );

//     // ✅ Budget warning
//     if (data.budgetWarning) {
//       alert(data.budgetWarning);
//     }

//     // ✅ Sync with backend
//     fetchBills();

//   } catch (err) {
//     console.log(err);
//     alert("Something went wrong");
//   }
// };

     

//   const startEdit = (bill) => {
//     setEditingBill(bill._id);
//     setFormData({
//       category: bill.category,
//       amount: bill.amount,
//       dueDate: bill.dueDate.split("T")[0],
//     });
//   };

//   const handleEdit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");

//     await fetch(`/api/bills/edit/${editingBill}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(formData),
//     });

//     setEditingBill(null);
//     fetchBills();
//   };

//   const isOverdue = (dueDate, paid) => {
//   if (paid) return false;

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const due = new Date(dueDate);
//   due.setHours(0, 0, 0, 0);

//   return today > due;
// };

//    const filteredBills = bills.filter((bill) => {
//   const search = searchTerm.toLowerCase();

//   return (
//     bill.category.toLowerCase().includes(search) ||
//     bill.amount.toString().includes(search) ||
//     (bill.paid ? "paid" : "unpaid").includes(search) ||
//     new Date(bill.dueDate).toLocaleDateString().includes(search)
//   );
// });


//   return (
//     <div className="bills-page">
//       <h2>Your Bills</h2>

//       <input
//         type="text"
//         placeholder="Search"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="search-input"
//       />

//       {filteredBills.map((bill) => (
//         <div key={bill._id} className="bill-card">
//           {editingBill === bill._id ? (
//             <form onSubmit={handleEdit}>
//               <input
//                 type="text"
//                 value={formData.category}
//                 onChange={(e) =>
//                   setFormData({ ...formData, category: e.target.value })
//                 }
//                 required
//               />

//               <input
//                 type="number"
//                 value={formData.amount}
//                 onChange={(e) =>
//                   setFormData({ ...formData, amount: e.target.value })
//                 }
//                 required
//               />

//               <input
//                 type="date"
//                 value={formData.dueDate}
//                 onChange={(e) =>
//                   setFormData({ ...formData, dueDate: e.target.value })
//                 }
//                 required
//               />

//               <button type="submit">Save</button>
//               <button onClick={() => setEditingBill(null)}>Cancel</button>
//             </form>
//           ) : (
//             <>
//               <h3>{bill.category}</h3>
//               <p>Amount: ₹{bill.amount}</p>
//               <p>Due Date: {new Date(bill.dueDate).toLocaleDateString()}</p>
//               <p>Status: {bill.paid ? "Paid ✅" : "Unpaid "}</p>

//               {isOverdue(bill.dueDate, bill.paid) && (
//                 <p className="overdue">⚠ Overdue!</p>
//               )}

//               {!bill.paid && (
//                 <button onClick={() => markAsPaid(bill._id)}>
//                   Mark as Paid
//                 </button>
//               )}

//               <button onClick={() => startEdit(bill)}>Edit</button>
//             </>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default Bills;





const BASE_URL = "https://smart-bill-manager-1.onrender.com";

import { useEffect, useState } from "react";
import "./Bills.css";

function Bills() {
  const [bills, setBills] = useState([]);
  const [editingBill, setEditingBill] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    dueDate: "",
  });

  // ✅ Fetch bills on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      window.location.href = "/login"; // ✅ safer redirect if token missing
      return;
    }
    fetchBills();
  }, []);

  const fetchBills = async () => {
    const token = localStorage.getItem("token");
    if (!token) return; // ✅ double safety

    try {
      const res = await fetch(`${BASE_URL}/api/bills`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Check if server returned error
      if (!res.ok) {
        const errorData = await res.json();
        alert("Error fetching bills: " + (errorData.message || "Server error"));
        return;
      }

      // ✅ Safe JSON parsing
      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.error("Failed to parse JSON:", err);
        alert("Server error. Could not load bills.");
        return;
      }

      setBills(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch bills. Check your connection.");
    }
  };

  const markAsPaid = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again");
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/bills/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paid: true }),
      });

      // ✅ Check response before parsing
      if (!res.ok) {
        const errData = await res.json();
        alert("Failed to mark as paid: " + (errData.message || "Server error"));
        return;
      }

      const data = await res.json();

      // ✅ Update UI immediately
      setBills((prevBills) =>
        prevBills.map((bill) =>
          bill._id === id ? { ...bill, paid: true } : bill
        )
      );

      if (data.budgetWarning) {
        alert(data.budgetWarning);
      }

      // ✅ Optional: sync backend data again
      fetchBills();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const startEdit = (bill) => {
    setEditingBill(bill._id);
    setFormData({
      category: bill.category,
      amount: bill.amount,
      dueDate: bill.dueDate.split("T")[0],
    });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again");
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/bills/edit/${editingBill}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert("Failed to edit bill: " + (errData.message || "Server error"));
        return;
      }

      setEditingBill(null);
      fetchBills();
    } catch (err) {
      console.error(err);
      alert("Failed to update bill");
    }
  };

  const isOverdue = (dueDate, paid) => {
    if (paid) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    return today > due;
  };

  const filteredBills = bills.filter((bill) => {
    const search = searchTerm.toLowerCase();
    return (
      bill.category.toLowerCase().includes(search) ||
      bill.amount.toString().includes(search) ||
      (bill.paid ? "paid" : "unpaid").includes(search) ||
      new Date(bill.dueDate).toLocaleDateString().includes(search)
    );
  });

  return (
    <div className="bills-page">
      <h2>Your Bills</h2>

      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {filteredBills.map((bill) => (
        <div key={bill._id} className="bill-card">
          {editingBill === bill._id ? (
            <form onSubmit={handleEdit}>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              />
              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                required
              />
              <button type="submit">Save</button>
              <button
                type="button"
                onClick={() => setEditingBill(null)}
              >
                Cancel
              </button>
            </form>
          ) : (
            <>
              <h3>{bill.category}</h3>
              <p>Amount: ₹{bill.amount}</p>
              <p>Due Date: {new Date(bill.dueDate).toLocaleDateString()}</p>
              <p>Status: {bill.paid ? "Paid ✅" : "Unpaid"}</p>

              {isOverdue(bill.dueDate, bill.paid) && (
                <p className="overdue">⚠ Overdue!</p>
              )}

              {!bill.paid && (
                <button onClick={() => markAsPaid(bill._id)}>
                  Mark as Paid
                </button>
              )}

              <button onClick={() => startEdit(bill)}>Edit</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Bills;