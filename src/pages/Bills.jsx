
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

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/bills", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setBills(data);
  };

  const markAsPaid = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/bills/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paid: true }),
    });

    const data = await res.json();

   
    if (data.budgetWarning) {
      alert(data.budgetWarning);
    }

    fetchBills();
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

    await fetch(`/api/bills/edit/${editingBill}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    setEditingBill(null);
    fetchBills();
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
              <button onClick={() => setEditingBill(null)}>Cancel</button>
            </form>
          ) : (
            <>
              <h3>{bill.category}</h3>
              <p>Amount: ₹{bill.amount}</p>
              <p>Due Date: {new Date(bill.dueDate).toLocaleDateString()}</p>
              <p>Status: {bill.paid ? "Paid ✅" : "Unpaid "}</p>

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
