import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DashBoard.css";

const API = "https://smart-bill-manager-1.onrender.com";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [bills, setBills] = useState([]);
  const [budget, setBudget] = useState(user?.monthlyBudget || 0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first"); // ✅ alert user
      navigate("/login");          // ✅ redirect if no token
      return;
    }
    fetchBills();
  }, []);

  // ✅ Fetch bills safely
  const fetchBills = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await axios.get(`${API}/api/bills`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Safe access: backend might send data differently
      setBills(res.data.bills || res.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch bills. Please login again."); // ✅ user-friendly
      navigate("/login");
    }
  };

  // ✅ Update monthly budget
  const handleBudgetUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await axios.put(
        `${API}/api/users/update-budget`,
        { monthlyBudget: budget },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Budget updated!");
    } catch (error) {
      console.error(error);
      alert("Failed to update budget");
    }
  };

  // ✅ Delete a bill safely
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      await axios.delete(`${API}/api/bills/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ update UI immediately
      setBills((prevBills) => prevBills.filter((bill) => bill._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete bill");
    }
  };

  // ✅ Calculations
  const totalBills = bills.length;
  const totalAmount = bills.reduce((sum, bill) => sum + Number(bill.amount), 0);
  const unpaidBills = bills.filter((bill) => !bill.paid).length;
  const isExceeded = totalAmount > budget;
  const exceededAmount = totalAmount - budget;

  return (
    <div className="dashboard">
      {/* Navbar */}
      <div className="navbar">
        <h2>Welcome {user?.name || "User"}</h2>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary">
        <div className="card">
          <h4>Total Bills</h4>
          <p>{totalBills}</p>
        </div>

        <div className="card">
          <h4>Total Amount</h4>
          <p>₹ {totalAmount}</p>
        </div>

        <div className="card">
          <h4>Unpaid Bills</h4>
          <p>{unpaidBills}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="actions">
        <div className="action-card" onClick={() => navigate("/add-bill")}>
          ➕ Add Bill
        </div>

        <div className="action-card" onClick={() => navigate("/bills")}>
          📋 All Bills
        </div>

        <div className="action-card" onClick={() => navigate("/reports")}>
          📊 Reports
        </div>
      </div>

      {/* Budget Section */}
      <div className="budget-section">
        <h3>Set Monthly Budget</h3>

        <div className="budget-input-group">
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
          />
          <button onClick={handleBudgetUpdate}>Save</button>
        </div>
      </div>

      {isExceeded && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          ⚠️ You have exceeded your monthly budget by ₹ {exceededAmount}
        </p>
      )}

      {/* Bills Section */}
      <div className="upcoming">
        <h3>Your Bills</h3>

        {bills.map((bill) => (
          <div key={bill._id} className="bill-row">
            <span>{bill.category}</span>
            <span>₹ {bill.amount}</span>
            <span>{new Date(bill.dueDate).toLocaleDateString()}</span>
            <span>{bill.paid ? "Paid" : "Unpaid"}</span>

            <button
              onClick={() => handleDelete(bill._id)}
              style={{
                background: "#ff4d4d",
                border: "none",
                color: "white",
                padding: "6px 10px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;