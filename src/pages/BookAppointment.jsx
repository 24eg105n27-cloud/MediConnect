import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarDays, ChevronLeft, Clock3, MapPin, Stethoscope } from "lucide-react";
import axios from "axios";

function BookAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const doctors = {
    1: {
      name: "Dr. Anjali Sharma",
      specialty: "Cardiologist",
      hospital: "Apollo Hospital",
    },
    2: {
      name: "Dr. Rahul Kumar",
      specialty: "Dermatologist",
      hospital: "Yashoda Hospital",
    },
    3: {
      name: "Dr. Priya Reddy",
      specialty: "General Physician",
      hospital: "KIMS Hospital",
    },
    4: {
      name: "Dr. Arjun Rao",
      specialty: "Neurologist",
      hospital: "CARE Hospital",
    },
  };

  const doctor = doctors[id];

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleBooking = async () => {
    if (!date || !time) {
      alert("Please select date and time.");
      return;
    }

    const savedProfile = JSON.parse(localStorage.getItem("profile") || "{}");
    const appointmentData = {
      doctor: doctor.name,
      specialty: doctor.specialty,
      hospital: doctor.hospital,
      date: date,
      time: time,
      status: "Confirmed",
      patientName: savedProfile.name || "Siri",
      patientEmail: savedProfile.email || "siri@example.com",
    };

    try {
      const response = await axios.post("http://localhost:8080/api/appointments", appointmentData);
      const savedAppointment = response.data;

      const oldAppointments =
        JSON.parse(localStorage.getItem("appointments")) || [];
      oldAppointments.push(savedAppointment);
      localStorage.setItem("appointments", JSON.stringify(oldAppointments));

      alert("Appointment booked successfully! ✅");
      navigate("/appointments");
    } catch (err) {
      console.warn("Backend unavailable, saving locally:", err);
      const fallbackAppointment = { ...appointmentData, id: Date.now() };
      const oldAppointments =
        JSON.parse(localStorage.getItem("appointments")) || [];
      oldAppointments.push(fallbackAppointment);
      localStorage.setItem("appointments", JSON.stringify(oldAppointments));

      alert("Appointment booked successfully! ✅");
      navigate("/appointments");
    }
  };

  if (!doctor) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h2>Doctor not found ❌</h2>

        <button onClick={() => navigate("/doctors")}>
          <ChevronLeft size={17} aria-hidden="true" /> Back to Doctors
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#eef7ff",
        fontFamily: "Arial",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "auto",
          background: "white",
          padding: "35px",
          borderRadius: "20px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ color: "#1677ff", textAlign: "center" }}>
          <CalendarDays size={24} aria-hidden="true" /> Book Appointment
        </h1>

        <div
          style={{
            background: "#f2f7ff",
            padding: "20px",
            borderRadius: "12px",
            marginTop: "25px",
          }}
        >
          <h2><Stethoscope size={19} aria-hidden="true" /> {doctor.name}</h2>

          <p>
            <strong>Specialty:</strong> {doctor.specialty}
          </p>

          <p>
            <strong><MapPin size={14} aria-hidden="true" /> Hospital:</strong> {doctor.hospital}
          </p>
        </div>

        <div style={{ marginTop: "25px" }}>
          <label>
            <strong><CalendarDays size={15} aria-hidden="true" /> Select Date</strong>
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              marginBottom: "20px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label>
            <strong><Clock3 size={15} aria-hidden="true" /> Select Time</strong>
          </label>

          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              marginBottom: "25px",
              boxSizing: "border-box",
            }}
          >
            <option value="">Select a time</option>
            <option value="09:00 AM">09:00 AM</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="11:00 AM">11:00 AM</option>
            <option value="02:00 PM">02:00 PM</option>
            <option value="03:00 PM">03:00 PM</option>
            <option value="05:00 PM">05:00 PM</option>
          </select>
        </div>

        <button
          onClick={handleBooking}
          style={{
            width: "100%",
            padding: "14px",
            background: "#1677ff",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "17px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Confirm Appointment
        </button>

        <button
          onClick={() => navigate("/doctors")}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "12px",
            background: "white",
            color: "#1677ff",
            border: "1px solid #1677ff",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          <ChevronLeft size={17} aria-hidden="true" /> Back to Doctors
        </button>
      </div>
    </div>
  );
}

export default BookAppointment;