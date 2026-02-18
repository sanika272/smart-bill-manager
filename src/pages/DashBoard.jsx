 import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DashBoard.css";

const API = import.meta.env.VITE_API_URL;
console.log("API URL:", API);

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [bills, setBills] = useState([]);
  const [budget, setBudget] = useState(user?.monthlyBudget || 0);

  const fetchBills = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(`${API}/api/bills`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data.bills || res.data || [];
      setBills(data);
      checkNotifications(data);
    } catch (error) {
      console.log("Fetch error:", error);
      navigate("/login");
    }
  };

  const handleBudgetUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${API}/api/users/update-budget`,
        { monthlyBudget: budget },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Budget updated successfully!");
    } catch (error) {
      console.log(error);
      alert("Failed to update budget");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API}/api/bills/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBills(bills.filter((bill) => bill._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const checkNotifications = (billsData) => {
    if (!Array.isArray(billsData)) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    billsData.forEach((bill) => {
      const dueDate = new Date(bill.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      const notificationKey = `notified_${bill._id}`;

      if (!bill.paid) {
        if (dueDate < today && !localStorage.getItem(notificationKey)) {
          alert(`Bill Overdue: ${bill.category} (₹${bill.amount})`);
          localStorage.setItem(notificationKey, "true");
        }

        const diffDays = (dueDate - today) / (1000 * 60 * 60 * 24);

        if (
          diffDays <= 2 &&
          diffDays >= 0 &&
          !localStorage.getItem(notificationKey)
        ) {
          alert(
            `Bill Due Soon: ${bill.category} in ${Math.ceil(diffDays)} day(s)`
          );
          localStorage.setItem(notificationKey, "true");
        }
      }
    });
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const totalBills = bills.length;
  const totalAmount = bills.reduce(
    (sum, bill) => sum + Number(bill.amount),
    0
  );
  const unpaidBills = bills.filter((bill) => !bill.paid).length;
  const budgetExceeded = totalAmount > budget;

  return (
    <div className="dashboard">
      <div className="navbar">
        <h2>Welcome {user?.name || "User"}</h2>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>

      <div className="budget-section">
        <h3>Set Monthly Budget</h3>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
        />
        <button onClick={handleBudgetUpdate}>Save</button>

        {budgetExceeded && (
          <p style={{ color: "red" }}>
            You exceeded your monthly budget by ₹{totalAmount - budget}
          </p>
        )}
      </div>

      <div className="summary">
        <p>Total Bills: {totalBills}</p>
        <p>Total Amount: ₹{totalAmount}</p>
        <p>Unpaid Bills: {unpaidBills}</p>
      </div>
    </div>
  );
};

export default Dashboard;