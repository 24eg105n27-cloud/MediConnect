import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Clock3, HeartPulse, MapPin, Stethoscope } from "lucide-react";
import axios from "axios";

function Appointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/appointments");
        if (response.data && response.data.length > 0) {
          setAppointments(response.data);
          localStorage.setItem("appointments", JSON.stringify(response.data));
          return;
        }
      } catch (err) {
        console.warn("Could not fetch appointments from backend, using localStorage:", err);
      }
      const local = JSON.parse(localStorage.getItem("appointments")) || [];
      setAppointments(local);
    };

    fetchAppointments();
  }, []);

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
          maxWidth: "900px",
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
          <span aria-hidden="true">‹</span> Dashboard
        </button>

        <h1 style={{ color: "#1677ff", marginTop: "30px" }}>
          <CalendarDays size={25} aria-hidden="true" /> My Appointments
        </h1>

        {appointments.length === 0 ? (
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

            <p>Book an appointment with a doctor to see it here.</p>

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
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              style={{
                background: "white",
                padding: "25px",
                marginTop: "25px",
                borderRadius: "18px",
                boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
              }}
            >
              <h2><Stethoscope size={20} aria-hidden="true" /> {appointment.doctor}</h2>

              <p>
                <strong><HeartPulse size={14} aria-hidden="true" /> Specialty:</strong>{" "}
                {appointment.specialty}
              </p>

              <p>
                <strong><MapPin size={14} aria-hidden="true" /> Hospital:</strong>{" "}
                {appointment.hospital}
              </p>

              <p>
                <strong><CalendarDays size={14} aria-hidden="true" /> Date:</strong>{" "}
                {appointment.date}
              </p>

              <p>
                <strong><Clock3 size={14} aria-hidden="true" /> Time:</strong>{" "}
                {appointment.time}
              </p>

              <p style={{ color: "green", fontWeight: "bold" }}>
                {appointment.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Appointments;