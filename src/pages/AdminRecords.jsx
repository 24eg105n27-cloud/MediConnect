import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Save, Stethoscope } from "lucide-react";
import axios from "axios";
import { authHeaders } from "../api.js";

function AdminRecords() {
  const navigate = useNavigate();

  const [patientEmail, setPatientEmail] = useState("");
  const [hospital, setHospital] = useState("");
  const [disease, setDisease] = useState("");
  const [medicines, setMedicines] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();

    if (
      !patientEmail ||
      !hospital ||
      !disease ||
      !medicines ||
      !visitDate
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const newRecord = {
      patientEmail,
      hospital,
      disease,
      medicines,
      visitDate,
      notes,
    };

    setSaving(true);
    setError("");
    try {
      await axios.post(
        "http://localhost:8080/api/medical-records",
        newRecord,
        { headers: authHeaders() }
      );

      alert("Medical Record Saved Successfully! ✅");

      setPatientEmail("");
      setHospital("");
      setDisease("");
      setMedicines("");
      setVisitDate("");
      setNotes("");
    } catch (error) {
      console.error("Error saving medical record:", error);
      setError(error.response?.data?.message || "The record could not be saved. Please check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#eef7ff",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          background: "white",
          padding: "35px",
          borderRadius: "20px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
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
          <ChevronLeft size={17} aria-hidden="true" /> Dashboard
        </button>

        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "#1677ff" }}>
            <Stethoscope size={23} aria-hidden="true" /> Admin / Doctor
          </h1>

          <p style={{ color: "#666" }}>
            Add patient's hospital visit and treatment record.
          </p>
        </div>

        <form onSubmit={handleSave}>
          <label>
            <strong>Patient account email *</strong>
          </label>

          <input
            type="email"
            value={patientEmail}
            onChange={(e) => setPatientEmail(e.target.value)}
            placeholder="Enter the patient’s registered email"
            style={inputStyle}
            required
          />

          <label>
            <strong>Hospital *</strong>
          </label>

          <input
            type="text"
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
            placeholder="Enter hospital name"
            style={inputStyle}
          />

          <label>
            <strong>Disease / Diagnosis *</strong>
          </label>

          <input
            type="text"
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
            placeholder="Enter disease or diagnosis"
            style={inputStyle}
          />

          <label>
            <strong>Medicines *</strong>
          </label>

          <input
            type="text"
            value={medicines}
            onChange={(e) => setMedicines(e.target.value)}
            placeholder="Enter prescribed medicines"
            style={inputStyle}
          />

          <label>
            <strong>Visit Date *</strong>
          </label>

          <input
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            style={inputStyle}
          />

          <label>
            <strong>Doctor Notes</strong>
          </label>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter doctor's notes"
            style={textareaStyle}
          />

          {error && <p role="alert" style={{ color: "#b42318", marginBottom: "16px" }}>{error}</p>}

          <button
            type="submit"
            disabled={saving}
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
            <Save size={17} aria-hidden="true" /> {saving ? "Saving..." : "Save Medical Record"}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "18px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  boxSizing: "border-box",
  fontSize: "15px",
};

const textareaStyle = {
  width: "100%",
  height: "100px",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "20px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  boxSizing: "border-box",
  fontSize: "15px",
  resize: "vertical",
};

export default AdminRecords;