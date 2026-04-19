import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

const BASE_URL = "https://smart-bill-manager-1.onrender.com";

function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();//prevent defualt is used to avoid refrese of page 
    setError("");

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      // ✅ POST request to login endpoint
      const res = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // ✅ parse JSON safely
      let data;
      try {
        data = await res.json();//i did treavel as string but due to this sentence it again gets converted to object 
      } catch (jsonErr) {
        console.error("Failed to parse JSON:", err);
        setError("Server returned invalid response");
        return;
      }

      if (res.status === 200) {
        // ✅ store token & user in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));//here we can't store it as a object bcoz local storage only store strings so we again use json/stringy here .
        navigate("/dashboard"); // ✅ redirect after successful login
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      // ✅ catch network/server errors
      setError("Server error: " + err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="center-wrapper">
        <h1 className="app-name">Smart Bill Manager</h1>
        <div className="login-box">
          <h2 className="login-title">Welcome Back</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <input type="email" placeholder="Email address" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Login</button>
          </form>
          {error && <p className="error-msg">{error}</p>}
          <p className="register-text">
            New user? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;