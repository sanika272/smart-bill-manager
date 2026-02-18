import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./Reports.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function Reports() {
  const [bills, setBills] = useState([]);

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

  const paidAmount = bills
    .filter((bill) => bill.paid)
    .reduce((acc, bill) => acc + Number(bill.amount), 0);

  const unpaidAmount = bills
    .filter((bill) => !bill.paid)
    .reduce((acc, bill) => acc + Number(bill.amount), 0);

  const chartData = {
    labels: ["Paid", "Unpaid"],
    datasets: [
      {
        label: "Bill Distribution",
        data: [paidAmount, unpaidAmount],
        backgroundColor: ["#6c63ff", "#ff4d6d"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="reports-page">
      <div className="reports-box">
        <h2>Reports</h2>

        <div className="chart-container">
          <Pie data={chartData} />
        </div>
      </div>
    </div>
  );
}

export default Reports;

