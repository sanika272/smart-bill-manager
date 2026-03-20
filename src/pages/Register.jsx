 import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const BASE_URL = "https://smart-bill-manager-1.onrender.com";

function Register() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    // ✅ Password matching check
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // ✅ POST request to registration endpoint
      const res = await fetch(`${BASE_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      // ✅ Safe JSON parsing
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        setError("Server returned invalid response");
        return;
      }

      if (res.status === 201) {
        navigate("/login"); // ✅ Redirect to login on success
      } else {
        setError(data.message || "Registration failed"); // ✅ Show proper error
      }
    } catch (err) {
      // ✅ Catch network/server errors
      setError("Server error: " + err.message);
    }
  };

  return (
    <div className="register-page">
      <div className="register-wrapper">
        <h1 className="register-app-name">Smart Bill Manager</h1>
        <div className="register-box">
          <h2 className="register-title">Create Account</h2>
          <form className="register-form" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Full Name" required />
            <input type="email" name="email" placeholder="Email address" required />
            <input type="password" name="password" placeholder="Password" required />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
            />
            <button type="submit">Register</button>
          </form>
          {error && <p className="error-msg">{error}</p>}
          <p className="login-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;