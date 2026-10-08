import { useNavigate } from "react-router-dom";

function Appointments() {
  const navigate = useNavigate();

  const savedAppointment = localStorage.getItem("appointment");

  const appointment = savedAppointment
    ? JSON.parse(savedAppointment)
    : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#eef7ff",
        padding: "40px 20px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "auto",
        }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "10px 18px",
            background: "#1677ff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          ← Dashboard
        </button>

        <h1 style={{ color: "#1677ff", marginTop: "30px" }}>
          📅 My Appointments
        </h1>

        {!appointment ? (
          <div
            style={{
              background: "white",
              padding: "40px",
              marginTop: "25px",
              borderRadius: "18px",
              textAlign: "center",
            }}
          >
            <h2>No appointments yet</h2>

            <p>Book a doctor appointment to see it here.</p>

            <button
              onClick={() => navigate("/doctors")}
              style={{
                padding: "12px 20px",
                background: "#1677ff",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Find a Doctor
            </button>
          </div>
        ) : (
          <div
            style={{
              background: "white",
              padding: "30px",
              marginTop: "25px",
              borderRadius: "18px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
            }}
          >
            <h2>👨‍⚕️ {appointment.doctor}</h2>

            <p>
              <strong>Specialty:</strong> {appointment.specialty}
            </p>

            <p>
              <strong>Hospital:</strong> {appointment.hospital}
            </p>

            <p>
              <strong>📅 Date:</strong> {appointment.date}
            </p>

            <p>
              <strong>⏰ Time:</strong> {appointment.time}
            </p>

            <p
              style={{
                color: "green",
                fontWeight: "bold",
              }}
            >
              ✅ {appointment.status}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Appointments;