 
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DashBoard.css";

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

      const res = await axios.get("http://localhost:5000/api/bills", {
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
        "http://localhost:5000/api/users/update-budget",
        { monthlyBudget: budget },
        { headers: { Authorization: `Bearer ${token}` } },
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

      await axios.delete(`http://localhost:5000/api/bills/${id}`, {
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
        alert(`⚠️ Bill Overdue: ${bill.category} (₹${bill.amount})`);
        localStorage.setItem(notificationKey, "true");
      }

      const diffDays = (dueDate - today) / (1000 * 60 * 60 * 24);

    
      if (
        diffDays <= 2 &&
        diffDays >= 0 &&
        !localStorage.getItem(notificationKey)
      ) {
        alert(
          `⏰ Bill Due Soon: ${bill.category} in ${Math.ceil(diffDays)} day(s)`
        );
        localStorage.setItem(notificationKey, "true");
      }
    }
  });
};



 
  useEffect(() => {
    fetchBills();
    const today = new Date();
    const currentMonth = today.getMonth();
    const todayDate = today.getDate();

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (
      todayDate === 1 &&
      storedUser &&
      storedUser.budgetMonth !== currentMonth
    ) {
      alert("Please set your budget for this month!");
    }
  }, []);

 
  const totalBills = bills.length;
  const totalAmount = bills.reduce((sum, bill) => sum + Number(bill.amount), 0);
  const unpaidBills = bills.filter((bill) => !bill.paid).length;
  const budgetExceeded = totalAmount > budget;

 
  return (
    <div className="dashboard">
      <div className="navbar">
        <h2>Welcome {user?.name || "User"}</h2>
        <div className="nav-right">
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
        {budgetExceeded && (
          <p style={{ color: "red", marginTop: "10px" }}>
            ⚠ You exceeded your monthly budget by ₹{totalAmount - budget}
          </p>
        )}
      </div>

      {/* Summary Section */}
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

      {/* Actions */}
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

      {/* Bills List */}
      <div className="upcoming">
        <h3>Your Bills</h3>
        {bills.length === 0 ? (
          <p>No bills added yet</p>
        ) : (
          bills.map((bill) => (
            <div key={bill._id} className="bill-row">
              <span>{bill.category}</span>
              <span>₹ {bill.amount}</span>
              <span>{new Date(bill.dueDate).toLocaleDateString()}</span>
              <span>{bill.paid ? "Paid" : "Unpaid"}</span>

              {bill.paid && (
                <button
                  style={{
                    marginLeft: "10px",
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDelete(bill._id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
