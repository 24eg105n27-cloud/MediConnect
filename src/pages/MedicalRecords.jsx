import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, ClipboardList, FilePlus2, FileText, FolderOpen, LockKeyhole, Pill, ShieldCheck, Stethoscope, UserRound } from "lucide-react";
import axios from "axios";
import { authHeaders, getStoredUser } from "../api.js";

function MedicalRecords() {
  const navigate = useNavigate();
  const location = useLocation();
  const [records, setRecords] = useState([]);
  const [recordsError, setRecordsError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);
  const user = getStoredUser();
  const userRole = String(user?.role || "").toUpperCase();

  useEffect(() => {
    localStorage.removeItem("medicalRecords");

    const fetchRecords = async () => {
      setIsLoading(true);
      setRecordsError("");
      try {
        const response = await axios.get("http://localhost:8080/api/medical-records", {
          headers: authHeaders(),
        });
        if (!Array.isArray(response.data)) {
          throw new Error("Medical records response was not a list");
        }
        setRecords(response.data);
      } catch (err) {
        console.error("Could not fetch medical records:", err);
        setRecordsError(
          err.response?.status === 401
            ? "Please sign in again to view your private medical records."
            : "Your records could not be loaded. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();

  }, [reloadToken]);

  return (
    <main className="medical-records-page">
      <div className="medical-records-shell">
        <nav className="medical-records-toolbar" aria-label="Records navigation">
          <button className="medical-records-back" type="button" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={17} aria-hidden="true" /> Dashboard
          </button>
          <span className="medical-records-private-label"><LockKeyhole size={14} aria-hidden="true" /> Private health space</span>
        </nav>

        <header className="medical-records-hero">
          <div className="medical-records-hero-icon" aria-hidden="true"><ClipboardList size={25} /></div>
          <p className="medical-records-eyebrow">YOUR PERSONAL HEALTH TIMELINE</p>
          <h1>Medical records</h1>
          <p className="medical-records-subtitle">A clear, secure place for the care details that matter to you.</p>
          {location.state?.recordSaved && (
            <p className="medical-records-saved" role="status">
              <ShieldCheck size={17} aria-hidden="true" /> Your history entry was saved to your account.
            </p>
          )}
        </header>

        {userRole === "PATIENT" && (
          <section className="medical-records-add-panel">
            <span className="medical-records-add-icon"><FilePlus2 size={21} aria-hidden="true" /></span>
            <div>
              <h2>Keep your health history together</h2>
              <p>Add details from a past visit. Your entry will be clearly marked as patient-reported.</p>
            </div>
            <button type="button" onClick={() => navigate("/my-records/new")}>Add a past visit</button>
          </section>
        )}

        {recordsError ? (
          <div className="medical-records-error-card" role="alert">
            <LockKeyhole size={22} aria-hidden="true" />
            <div className="medical-records-error-copy">
              <h2>Private records unavailable</h2>
              <p>{recordsError}</p>
              {recordsError.includes("sign in again")
                ? <Link to="/login">Sign in</Link>
                : <button type="button" onClick={() => setReloadToken((token) => token + 1)}>Try again</button>}
            </div>
          </div>
        ) : isLoading ? (
          <div className="medical-records-loading" role="status">
            <span className="medical-records-spinner" aria-hidden="true" />
            <p>Loading your private records…</p>
          </div>
        ) : records.length === 0 ? (
          <section className="medical-records-empty">
            <span className="medical-records-empty-icon"><FolderOpen size={30} aria-hidden="true" /></span>
            <p className="medical-records-eyebrow">YOUR TIMELINE STARTS HERE</p>
            <h2>No records yet</h2>
            <p>Your saved visit history and care details will appear here. Only records linked to your account are shown.</p>
            {userRole === "PATIENT" && (
              <button type="button" onClick={() => navigate("/my-records/new")}>Add your first past visit</button>
            )}
            {userRole === "DOCTOR" && (
              <button type="button" onClick={() => navigate("/admin-records")}>Add medical record</button>
            )}
          </section>
        ) : (
          <section className="medical-records-timeline" aria-labelledby="medical-records-timeline-title">
            <div className="medical-records-timeline-heading">
              <div>
                <p className="medical-records-eyebrow">YOUR CARE HISTORY</p>
                <h2 id="medical-records-timeline-title">Visit timeline</h2>
              </div>
              <span className="medical-records-count">
                {records.length} {records.length === 1 ? "record" : "records"}
              </span>
            </div>

            <div className="medical-record-list">
              {records.slice().reverse().map((record, index) => {
                const isPatientReported = record.recordSource === "PATIENT_REPORTED";
                const sourceLabel = isPatientReported
                  ? "Patient-reported"
                  : record.recordSource === "CLINICIAN_ENTERED"
                    ? "Care provider entry"
                    : "Source not recorded";

                return (
                  <article className="medical-record-card" key={record.id}>
                    <header className="medical-record-card-header">
                      <div className="medical-record-card-title">
                        <span className="medical-record-card-icon"><FileText size={18} aria-hidden="true" /></span>
                        <div>
                          <p className="medical-record-visit-number">VISIT {records.length - index}</p>
                          <h3>{record.hospital || "Clinic not provided"}</h3>
                        </div>
                      </div>
                      <span className="medical-record-date"><CalendarDays size={15} aria-hidden="true" /> {record.visitDate || "Date not provided"}</span>
                    </header>

                    <div className="medical-record-card-body">
                      <span className={`medical-record-source ${isPatientReported ? "is-patient-reported" : ""}`}>
                        <ShieldCheck size={14} aria-hidden="true" /> {sourceLabel}
                      </span>
                      <div className="medical-record-details">
                        <Info icon={<UserRound size={16} />} title="Patient" value={record.patientName} />
                        <Info icon={<Stethoscope size={16} />} title="Doctor" value={record.doctor} />
                        <Info icon={<FileText size={16} />} title="Diagnosis or visit reason" value={record.disease} />
                        <Info icon={<Pill size={16} />} title="Medicines" value={record.medicines} />
                      </div>

                      {record.notes && (
                        <section className="medical-record-notes">
                          <h4>Visit notes</h4>
                          <p>{record.notes}</p>
                        </section>
                      )}

                      <p className="medical-record-provenance">
                        <LockKeyhole size={14} aria-hidden="true" />
                        {isPatientReported
                          ? "Entered by you; not clinician-verified."
                          : record.recordSource === "CLINICIAN_ENTERED"
                            ? "Entered by a care provider."
                            : "Record source was not recorded."}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function Info({ icon, title, value }) {
  return (
    <div className="medical-record-info">
      <div className="medical-record-info-label">{icon} {title}</div>
      <strong>{value || "Not provided"}</strong>
    </div>
  );
}

export default MedicalRecords;