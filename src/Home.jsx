import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      
      <h1>🏥 MediConnect</h1>

      <h2>Your Health, Our Priority ❤️</h2>

      <p>
        Book doctor appointments and manage your medical records easily.
      </p>

      <br />

      <Link to="/login">
        <button>Login</button>
      </Link>

      {" "}

      <Link to="/register">
        <button>Register</button>
      </Link>

      <br /><br />

      <button
        onClick={() => alert("Find Doctor feature coming next! 👨‍⚕️")}
      >
        Find Doctor
      </button>

      {" "}

      <button
        onClick={() => alert("Book Appointment feature coming next! 📅")}
      >
        Book Appointment
      </button>

    </div>
  );
}

export default Home;