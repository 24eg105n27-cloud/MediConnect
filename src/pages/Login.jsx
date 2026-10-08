import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { HeartPulse } from "lucide-react";
import axios from "axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      if (response.data.success && response.data.user) {
        const user = response.data.user;
        localStorage.setItem("user", JSON.stringify(user));
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
        }
        localStorage.setItem("profile", JSON.stringify({
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          age: user.age || "",
          gender: user.gender || "",
          role: user.role || "PATIENT",
        }));
        const returnTo = searchParams.get("returnTo");
        const safeReturnTo = returnTo === "/shared-records" ? returnTo : "/dashboard";
        navigate(safeReturnTo);
        return;
      }

      alert(response.data.message || "Login could not be completed.");
    } catch (err) {
      console.error("Backend login failed:", err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Unable to reach MediConnect. Check your connection and try again.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-layout">
        <section className="login-visual" aria-label="Healthcare records">
          <img src="/login-care.jpg" alt="A stethoscope beside a computer, representing connected healthcare and digital records" />
          <div className="login-visual-shade" />
          <div className="login-visual-copy">
            <span><HeartPulse size={16} aria-hidden="true" /> CARE, CONNECTED</span>
            <h2>Your health story,<br />all in one place.</h2>
            <p>Appointments, care teams and medical records—thoughtfully connected.</p>
          </div>
        </section>

        <section className="login-card">
          <div className="login-icon">
            <HeartPulse size={31} aria-hidden="true" />
          </div>

          <h1>Welcome Back</h1>

          <p className="login-subtitle">Login to your MediConnect account</p>

          <form onSubmit={handleLogin}>
            <label className="login-field-label" htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="login-field-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="login-btn" type="submit">
              Login
            </button>
          </form>

          <p className="register-text">
            Don&apos;t have an account?{" "}
            <Link to="/register">
              Register
            </Link>
          </p>
        </section>

      </div>
    </div>
  );
}

export default Login;