import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HeartPulse } from "lucide-react";
import axios from "axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", {
        name,
        email,
        password,
      });

      if (response.data.success) {
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("profile", JSON.stringify({
            name: response.data.user.name,
            email: response.data.user.email,
            phone: response.data.user.phone || "",
            age: response.data.user.age || "",
            gender: response.data.user.gender || "",
            role: response.data.user.role || "PATIENT",
          }));
        }
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
          navigate("/dashboard");
        } else {
          alert("Registration completed, but a secure session was not issued. Please sign in.");
          navigate("/login");
        }
      } else {
        alert(response.data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Backend registration error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Unable to reach MediConnect. Check your connection and try again.");
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <div className="register-icon">
          <HeartPulse size={30} aria-hidden="true" />
        </div>

        <h1>Create Account</h1>

        <p>Join MediConnect today</p>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit">
            Create Account
          </button>

        </form>

        <p className="login-text">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;