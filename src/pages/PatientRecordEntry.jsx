import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, FilePlus2, ShieldCheck } from "lucide-react";
import axios from "axios";
import { authHeaders } from "../api.js";

const emptyRecord = {
  hospital: "",
  visitDate: "",
  disease: "",
  medicines: "",
  doctor: "",
  notes: "",
};

function PatientRecordEntry() {
  const navigate = useNavigate();
  const [record, setRecord] = useState(emptyRecord);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const updateField = (event) => {
    setRecord((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const saveRecord = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await axios.post(
        "http://localhost:8080/api/medical-records/self-reported",
        record,
        { headers: authHeaders() }
      );
      navigate("/medical-records", { state: { recordSaved: true } });
    } catch (requestError) {
      console.error("Could not save patient-reported history:", requestError);
      setError(requestError.response?.data?.message || "The history could not be saved. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="patient-record-entry">
      <section className="patient-record-entry-card">
        <button className="patient-record-back" type="button" onClick={() => navigate("/medical-records")}>
          <ChevronLeft size={17} aria-hidden="true" /> Medical records
        </button>
        <div className="patient-record-entry-heading">
          <span><FilePlus2 size={24} aria-hidden="true" /></span>
          <p>PERSONAL HEALTH HISTORY</p>
          <h1>Add a past visit</h1>
          <p>Enter details from your records as accurately as possible.</p>
        </div>
        <div className="patient-record-disclaimer">
          <ShieldCheck size={18} aria-hidden="true" />
          <p><strong>Patient-reported, not clinician-verified.</strong> This entry is saved to your account with that label so clinicians can distinguish it from a record entered by a care provider.</p>
        </div>
        <form className="patient-record-form" onSubmit={saveRecord}>
          <label>
            Hospital or clinic *
            <input name="hospital" value={record.hospital} onChange={updateField} maxLength={255} required />
          </label>
          <label>
            Visit date *
            <input name="visitDate" type="date" value={record.visitDate} onChange={updateField} required />
          </label>
          <label>
            Diagnosis or reason for visit *
            <input name="disease" value={record.disease} onChange={updateField} maxLength={255} required />
          </label>
          <label>
            Medicines shown on your paperwork
            <input name="medicines" value={record.medicines} onChange={updateField} maxLength={255} />
          </label>
          <label>
            Clinician name (if known)
            <input name="doctor" value={record.doctor} onChange={updateField} maxLength={255} />
          </label>
          <label>
            Additional details
            <textarea name="notes" value={record.notes} onChange={updateField} maxLength={1000} rows={4} />
          </label>
          {error && <p className="patient-record-error" role="alert">{error}</p>}
          <button className="patient-record-submit" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save to my records"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default PatientRecordEntry;
