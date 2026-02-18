 import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.status === 200) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); 
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
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



 