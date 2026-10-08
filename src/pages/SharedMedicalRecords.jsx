import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  FileText,
  Hospital,
  LockKeyhole,
  Pill,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";
import axios from "axios";
import { authHeaders, getStoredUser } from "../api.js";

function readShareToken() {
  const tokenFromUrl = window.location.hash.slice(1);
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  if (tokenFromUrl) {
    sessionStorage.setItem("pendingMedicalRecordShareToken", tokenFromUrl);
    return tokenFromUrl;
  }
  return sessionStorage.getItem("pendingMedicalRecordShareToken") || "";
}

function SharedMedicalRecords() {
  const navigate = useNavigate();
  const [token] = useState(readShareToken);
  const user = getStoredUser();
  const isDoctor = String(user?.role || "").toUpperCase() === "DOCTOR";
  const hasSession = Boolean(localStorage.getItem("authToken"));
  const [share, setShare] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(() => Boolean(token && hasSession && isDoctor));

  useEffect(() => {
    if (!token) return;
    if (!hasSession || !isDoctor) {
      if (hasSession && !isDoctor) {
        sessionStorage.removeItem("pendingMedicalRecordShareToken");
      }
      return;
    }

    let preserveTokenForReauthentication = false;
    axios.post(
      "http://localhost:8080/api/medical-records/shared",
      { token },
      { headers: authHeaders() }
    )
      .then((response) => setShare(response.data))
      .catch((requestError) => {
        console.error("Could not open shared medical records:", requestError);
        if (requestError.response?.status === 401) {
          preserveTokenForReauthentication = true;
          setError("Your doctor session has expired. Sign in again to continue.");
        } else if (requestError.response?.status === 403) {
          setError("This record share can only be opened by a doctor account.");
        } else if (requestError.response?.status === 404) {
          setError("This QR code has expired, been revoked, or is no longer available.");
        } else {
          setError("The shared records could not be loaded. Please try again.");
        }
      })
      .finally(() => {
        if (!preserveTokenForReauthentication) {
          sessionStorage.removeItem("pendingMedicalRecordShareToken");
        }
        setLoading(false);
      });
  }, [hasSession, isDoctor, token]);

  const signInUrl = `/login?returnTo=${encodeURIComponent("/shared-records")}`;

  return (
    <main className="shared-records-page">
      <header className="shared-records-header">
        <button type="button" onClick={() => navigate("/dashboard")}>
          <ChevronLeft size={17} aria-hidden="true" /> Dashboard
        </button>
        <span><LockKeyhole size={15} aria-hidden="true" /> Patient-authorized access</span>
      </header>

      <section className="shared-records-content">
        {loading ? (
          <div className="shared-records-state" role="status">
            <span className="shared-records-icon"><ShieldCheck size={24} /></span>
            <h1>Verifying secure access</h1>
            <p>Please wait while we validate this patient-approved share.</p>
          </div>
        ) : !token ? (
          <div className="shared-records-state" role="alert">
            <span className="shared-records-icon"><AlertCircle size={24} aria-hidden="true" /></span>
            <h1>QR code unavailable</h1>
            <p>{error || "This QR code is missing its access key. Ask the patient to create a new one."}</p>
          </div>
        ) : !hasSession ? (
          <div className="shared-records-state">
            <span className="shared-records-icon"><Stethoscope size={24} /></span>
            <h1>Doctor sign-in required</h1>
            <p>Sign in to your doctor account to view records the patient chose to share.</p>
            <Link className="shared-records-primary" to={signInUrl}>Sign in and continue</Link>
          </div>
        ) : !isDoctor ? (
          <div className="shared-records-state">
            <span className="shared-records-icon"><LockKeyhole size={24} /></span>
            <h1>Doctor account required</h1>
            <p>For privacy, only a signed-in doctor account can open this patient-approved record share.</p>
            <button type="button" onClick={() => navigate("/dashboard")}>Return to dashboard</button>
          </div>
        ) : error ? (
          <div className="shared-records-state" role="alert">
            <span className="shared-records-icon"><AlertCircle size={24} /></span>
            <h1>Records unavailable</h1>
            <p>{error}</p>
            {error.includes("session has expired") && (
              <Link className="shared-records-primary" to={signInUrl}>Sign in again</Link>
            )}
          </div>
        ) : share ? (
          <>
            <div className="shared-records-title">
              <p className="shared-records-eyebrow"><ShieldCheck size={15} aria-hidden="true" /> TEMPORARY PATIENT SHARE</p>
              <h1>Medical history</h1>
              <p>Records shared by <strong>{share.patientName || "the patient"}</strong></p>
              <div className="shared-records-expiry">
                <LockKeyhole size={15} aria-hidden="true" />
                Access ends {new Date(share.expiresAt).toLocaleString()}
              </div>
            </div>

            <div className="shared-records-notice">
              <LockKeyhole size={17} aria-hidden="true" />
              <p>Use this information only for the patient’s care. Access is temporary and may be revoked by the patient at any time.</p>
            </div>

            {share.records.length === 0 ? (
              <div className="shared-records-state">
                <FileText size={24} aria-hidden="true" />
                <h2>No records in this share</h2>
              </div>
            ) : (
              <div className="shared-record-list">
                {share.records.map((record, index) => (
                  <article className="shared-record-card" key={`${record.visitDate}-${record.hospital}-${index}`}>
                    <header>
                      <div>
                        <span className="shared-record-label">VISIT RECORD</span>
                        <h2>{record.hospital || "Hospital not provided"}</h2>
                      </div>
                      <span className="shared-record-date">
                        <CalendarDays size={15} aria-hidden="true" />
                        {record.visitDate || "Date not provided"}
                      </span>
                    </header>
                    <div className="shared-record-details">
                      <RecordField
                        icon={<ShieldCheck size={16} />}
                        title="Record source"
                        value={record.recordSource === "PATIENT_REPORTED"
                          ? "Patient-reported — not clinician-verified"
                          : record.recordSource === "CLINICIAN_ENTERED"
                            ? "Entered by care provider"
                            : "Source not recorded"}
                      />
                      <RecordField icon={<Stethoscope size={16} />} title="Doctor" value={record.doctor} />
                      <RecordField icon={<FileText size={16} />} title="Diagnosis" value={record.disease} />
                      <RecordField icon={<Pill size={16} />} title="Medicines" value={record.medicines} />
                      {record.notes && (
                        <RecordField icon={<UserRound size={16} />} title="Clinical notes" value={record.notes} />
                      )}
                    </div>
                    <Hospital className="shared-record-watermark" size={78} aria-hidden="true" />
                  </article>
                ))}
              </div>
            )}
          </>
        ) : null}
      </section>
    </main>
  );
}

function RecordField({ icon, title, value }) {
  return (
    <div className="shared-record-field">
      <span>{icon}{title}</span>
      <strong>{value || "Not provided"}</strong>
    </div>
  );
}

export default SharedMedicalRecords;
