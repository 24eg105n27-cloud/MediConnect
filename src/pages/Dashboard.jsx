import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUpRight, BrainCircuit, CalendarClock, CalendarDays, FileText, HeartPulse, MapPin, Menu, ShieldCheck, Stethoscope, UserRound, X } from "lucide-react";
import axios from "axios";
import { defaultDoctors, getDoctorInitials, getDoctorPortrait } from "../doctorPortraits.js";
import { authHeaders } from "../api.js";

const doctorPortraits = [
  "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=700",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?auto=format&fit=crop&w=700&q=80",
];

function readStoredList(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function getAppointmentDate(value) {
  if (!value || typeof value !== "string") return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function Dashboard() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [appointments, setAppointments] = useState(() => readStoredList("appointments"));
  const [records, setRecords] = useState([]);
  const [doctors, setDoctors] = useState(defaultDoctors);

  useEffect(() => {
    localStorage.removeItem("medicalRecords");

    axios.get("http://localhost:8080/api/doctors")
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length >= defaultDoctors.length) {
          setDoctors(res.data);
        }
      })
      .catch((err) => console.warn("Dashboard could not fetch doctors:", err));

    axios.get("http://localhost:8080/api/appointments")
      .then((res) => {
        if (res.data) {
          setAppointments(res.data);
          localStorage.setItem("appointments", JSON.stringify(res.data));
        }
      })
      .catch((err) => console.warn("Dashboard could not fetch appointments:", err));

    axios.get("http://localhost:8080/api/medical-records", { headers: authHeaders() })
      .then((res) => {
        if (res.data) {
          setRecords(res.data);
        }
      })
      .catch((err) => console.warn("Dashboard could not fetch private records:", err));
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = appointments
    .filter((appointment) => {
      const appointmentDate = getAppointmentDate(appointment.date);
      return appointment.status !== "Cancelled" && appointmentDate && appointmentDate >= today;
    })
    .sort((first, second) => {
      const dateDifference = getAppointmentDate(first.date) - getAppointmentDate(second.date);
      return dateDifference || (first.time || "").localeCompare(second.time || "");
    });

  const nextAppointment = upcomingAppointments[0];
  const doctorCount = new Set(
    appointments
      .filter((appointment) => appointment.status !== "Cancelled")
      .map((appointment) => appointment.doctor)
      .filter(Boolean)
  ).size;
  const nextAppointmentDate = nextAppointment
    ? getAppointmentDate(nextAppointment.date).toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
    : "";

  const handleLogout = async () => {
    try {
      if (localStorage.getItem("authToken")) {
        await axios.post("http://localhost:8080/api/auth/logout", {}, {
          headers: authHeaders(),
        });
      }
    } catch (error) {
      console.error("Could not revoke the session during logout:", error);
      window.alert("You have been signed out on this device, but the server could not revoke this session. It will expire automatically.");
    } finally {
      ["authToken", "user", "profile", "medicalRecords", "appointments"].forEach((key) => {
        localStorage.removeItem(key);
      });
      navigate("/login");
    }
  };

  return (
    <div className="dashboard-home">
      <nav className="dashboard-nav home-nav" aria-label="Main navigation">
        <NavLink className="dashboard-brand" to="/dashboard" aria-label="MediConnect dashboard">
          <span className="brand-mark" aria-hidden="true"><HeartPulse size={22} /></span>
          MediConnect
        </NavLink>

        <button
          className="dashboard-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="dashboard-nav-links"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>

        <div id="dashboard-nav-links" className={`dashboard-nav-links${menuOpen ? " is-open" : ""}`}>
          <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>Overview</NavLink>
          <NavLink to="/doctors" onClick={() => setMenuOpen(false)}>Doctors</NavLink>
          <NavLink to="/appointments" onClick={() => setMenuOpen(false)}>Appointments</NavLink>
          <NavLink to="/medical-records" onClick={() => setMenuOpen(false)}>Records</NavLink>
          <NavLink to="/profile" onClick={() => setMenuOpen(false)}>Profile</NavLink>
        </div>

        <button
          className="dashboard-logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>

      <main className="dashboard-home-content">
        <section className="home-welcome" aria-labelledby="home-welcome-title">
          <div className="home-welcome-copy">
            <p className="dashboard-eyebrow"><ShieldCheck size={15} aria-hidden="true" /> CARE, CONNECTED</p>
            <h1 id="home-welcome-title">
              Your health,
              <br />
              <span>thoughtfully connected.</span>
            </h1>
            <p className="home-welcome-description">
              A simpler way to find trusted care, stay on top of appointments,
              and keep your health information together.
            </p>
            <div className="home-specialty-preview" aria-label="Featured specialties">
              {defaultDoctors.map((doctor) => (
                <span key={doctor.specialty}>{doctor.specialty}</span>
              ))}
            </div>
            <div className="home-welcome-actions">
              <button type="button" onClick={() => navigate("/doctors#specialty-assistant")}>
                <BrainCircuit size={16} aria-hidden="true" /> Find a specialist for my symptoms
              </button>
              <button type="button" onClick={() => navigate("/doctors")}>
                Meet our doctors <ArrowRight size={16} aria-hidden="true" />
              </button>
              <button className="home-secondary-action" type="button" onClick={() => navigate("/appointments")}>
                View appointments
              </button>
            </div>
            <div className="home-trust-note">
              <ShieldCheck size={16} aria-hidden="true" />
              <span>Your care details, organized in one secure place</span>
            </div>
          </div>
          <div className="home-welcome-visual">
            <div className="home-welcome-photo">
              <img
                src={getDoctorPortrait(doctors[0]?.name) || doctorPortraits[0]}
                alt=""
                fetchPriority="high"
              />
              <div className="home-welcome-photo-shade" />
            </div>
            <div className="home-featured-doctor">
              <span className="home-featured-icon"><Stethoscope size={17} aria-hidden="true" /></span>
              {doctors[0] ? (
                <span>
                  <small>MEET YOUR CARE TEAM</small>
                  <strong>{doctors[0].name}</strong>
                  <em>{doctors[0].specialty}</em>
                </span>
              ) : (
                <span>
                  <small>YOUR CARE TEAM</small>
                  <strong>Find your specialist</strong>
                  <em>Browse our available doctors</em>
                </span>
              )}
            </div>
            <p className="home-portrait-disclaimer">Representative portrait</p>
          </div>
        </section>

        <section className="home-doctors-section" aria-labelledby="home-doctors-title">
          <div className="home-doctors-heading">
            <div>
              <p className="dashboard-eyebrow">MEET YOUR CARE TEAM</p>
              <h2 id="home-doctors-title">Meet our four doctors</h2>
              <p>Choose from cardiology, dermatology, general medicine, and neurology.</p>
            </div>
            <button type="button" onClick={() => navigate("/doctors")}>
              View all doctors <ArrowUpRight size={16} aria-hidden="true" />
            </button>
          </div>
          {doctors.length > 0 ? (
            <>
              <p className="home-doctors-disclaimer">
                Names and specialties are from the care directory. Portraits are representative images.
              </p>
              <div className="home-doctor-grid">
                {doctors.slice(0, 4).map((doctor) => (
                  <article className="home-doctor-card" key={doctor.id}>
                    <div className="home-doctor-photo">
                      <span className="home-doctor-initials" aria-hidden="true">
                        {getDoctorInitials(doctor.name)}
                      </span>
                      {getDoctorPortrait(doctor.name) && (
                        <img
                          src={getDoctorPortrait(doctor.name)}
                          alt=""
                          loading="lazy"
                          onError={(event) => event.currentTarget.classList.add("is-unavailable")}
                        />
                      )}
                    </div>
                    <div className="home-doctor-info">
                      <p>{doctor.specialty}</p>
                      <h3>{doctor.name}</h3>
                      {doctor.hospital && <span><MapPin size={14} aria-hidden="true" /> {doctor.hospital}</span>}
                      <button type="button" onClick={() => navigate(`/book/${doctor.id}`)}>
                        Book a visit <ArrowRight size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="home-doctors-empty">
              <Stethoscope size={20} aria-hidden="true" />
              <span>Connect to the care directory to see available doctors.</span>
            </div>
          )}
        </section>

        <section className="dashboard-stats" aria-label="Healthcare summary">
          <article className="dashboard-stat">
            <span className="dashboard-stat-icon"><CalendarDays size={19} aria-hidden="true" /></span>
            <p>Total appointments</p>
            <strong>{appointments.length}</strong>
          </article>
          <article className="dashboard-stat">
            <span className="dashboard-stat-icon"><CalendarClock size={19} aria-hidden="true" /></span>
            <p>Upcoming visits</p>
            <strong>{upcomingAppointments.length}</strong>
          </article>
          <article className="dashboard-stat">
            <span className="dashboard-stat-icon"><Stethoscope size={19} aria-hidden="true" /></span>
            <p>Doctors booked</p>
            <strong>{doctorCount}</strong>
          </article>
          <article className="dashboard-stat">
            <span className="dashboard-stat-icon"><FileText size={19} aria-hidden="true" /></span>
            <p>Medical records</p>
            <strong>{records.length}</strong>
          </article>
        </section>

        <section className="dashboard-next-visit" aria-label="Next appointment">
          <div className="next-visit-icon" aria-hidden="true"><CalendarClock size={23} /></div>
          <div className="next-visit-content">
            <p className="dashboard-eyebrow">YOUR NEXT VISIT</p>
            {nextAppointment ? (
              <>
                <h2>{nextAppointment.doctor}</h2>
                <p>
                  {nextAppointment.specialty} <span aria-hidden="true">·</span> {nextAppointmentDate} at {nextAppointment.time}
                </p>
                {nextAppointment.hospital && <p className="next-visit-location"><MapPin size={14} aria-hidden="true" /> {nextAppointment.hospital}</p>}
              </>
            ) : (
              <>
                <h2>No upcoming appointments</h2>
                <p>Choose a doctor to schedule your next visit.</p>
              </>
            )}
          </div>
          <button type="button" onClick={() => navigate(nextAppointment ? "/appointments" : "/doctors")}>
            {nextAppointment ? "View appointment" : "Find a doctor"} <ArrowUpRight size={16} aria-hidden="true" />
          </button>
        </section>

        <div className="dashboard-action-grid">
          {/* Find Doctor */}
          <div className="dashboard-action-card">
            <div className="dashboard-tile-icon" aria-hidden="true"><Stethoscope size={25} /></div>

            <h2>Find a Doctor</h2>

            <p>
              Search doctors and book an appointment.
            </p>

            <button className="home-action-button" onClick={() => navigate("/doctors")}>
              Find Doctor
            </button>
          </div>

          {/* Appointments */}
          <div className="dashboard-action-card">
            <div className="dashboard-tile-icon" aria-hidden="true"><CalendarDays size={25} /></div>

            <h2>Appointments</h2>

            <p>
              View your upcoming appointments.
            </p>

            <button className="home-action-button" onClick={() => navigate("/appointments")}>
              My Appointments
            </button>
          </div>

          {/* Medical Records */}
          <div className="dashboard-action-card">
            <div className="dashboard-tile-icon" aria-hidden="true"><FileText size={25} /></div>

            <h2>Medical Records</h2>

            <p>
              View your medical history and hospital records.
            </p>

            <button className="home-action-button" onClick={() => navigate("/medical-records")}>
              View Records
            </button>
          </div>

          {/* My Profile */}
          <div className="dashboard-action-card">
            <div className="dashboard-tile-icon" aria-hidden="true"><UserRound size={25} /></div>

            <h2>My Profile</h2>

            <p>
              Manage your personal information.
            </p>

            <button className="home-action-button" onClick={() => navigate("/profile")}>
              View Profile
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;