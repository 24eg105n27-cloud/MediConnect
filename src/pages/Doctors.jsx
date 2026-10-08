import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  AlertTriangle,
  BriefcaseBusiness,
  BrainCircuit,
  HeartPulse,
  MapPin,
  Menu,
  Search,
  Stethoscope,
  X,
} from "lucide-react";
import { defaultDoctors, getDoctorInitials, getDoctorPortrait } from "../doctorPortraits.js";
import { recommendSpecialty } from "../specialtyAdvisor.js";
import "./Doctors.css";

function Doctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState(defaultDoctors);
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [symptomText, setSymptomText] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch("http://localhost:8080/api/doctors", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load doctors (${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("The doctors response was not a list");
        }
        if (data.length > 0) {
          setDoctors(data);
        }
      })
      .catch((fetchError) => {
        if (fetchError.name !== "AbortError") {
          console.warn("Could not load the live doctor directory; showing the default care team:", fetchError);
        }
      });

    return () => controller.abort();
  }, []);

  const specialties = useMemo(
    () => [...new Set(doctors.map((doctor) => doctor.specialty).filter(Boolean))].sort(),
    [doctors]
  );

  const filteredDoctors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return doctors.filter((doctor) => {
      const matchesSpecialty =
        specialty === "all" || doctor.specialty === specialty;
      const searchableDetails = [
        doctor.name,
        doctor.specialty,
        doctor.hospital,
      ].filter(Boolean).join(" ").toLowerCase();
      return matchesSpecialty && searchableDetails.includes(normalizedQuery);
    });
  }, [doctors, query, specialty]);

  const hospitalCount = useMemo(
    () => new Set(doctors.map((doctor) => doctor.hospital).filter(Boolean)).size,
    [doctors]
  );

  const getDoctorsForSpecialty = (requestedSpecialty) => doctors.filter(
    (doctor) => doctor.specialty?.toLocaleLowerCase() === requestedSpecialty.toLocaleLowerCase()
  );

  const findSpecialist = (event) => {
    event.preventDefault();
    setRecommendation(recommendSpecialty(symptomText));
  };

  const showRecommendedDoctors = (requestedSpecialty) => {
    const matchingDoctor = getDoctorsForSpecialty(requestedSpecialty)[0];
    if (!matchingDoctor) {
      setSpecialty("all");
      setQuery("");
      document.getElementById("doctor-list")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setQuery("");
    setSpecialty(matchingDoctor.specialty);
    document.getElementById("doctor-list")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="doctor-directory">
      <nav className="dashboard-nav doctor-directory-nav" aria-label="Main navigation">
        <NavLink
          className="dashboard-brand"
          to="/dashboard"
          aria-label="MediConnect dashboard"
        >
          <span className="brand-mark" aria-hidden="true">
            <HeartPulse size={22} />
          </span>
          MediConnect
        </NavLink>

        <button
          className="dashboard-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="doctor-directory-links"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>

        <div
          id="doctor-directory-links"
          className={`dashboard-nav-links${menuOpen ? " is-open" : ""}`}
        >
          <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>Overview</NavLink>
          <NavLink className="active" to="/doctors" onClick={() => setMenuOpen(false)}>Doctors</NavLink>
          <NavLink to="/appointments" onClick={() => setMenuOpen(false)}>Appointments</NavLink>
          <NavLink to="/medical-records" onClick={() => setMenuOpen(false)}>Records</NavLink>
          <NavLink to="/profile" onClick={() => setMenuOpen(false)}>Profile</NavLink>
        </div>

      </nav>

      <section className="doctor-hero">
        <div className="doctor-hero-inner">
          <div className="doctor-hero-copy">
            <p className="doctor-eyebrow">
              <HeartPulse size={15} aria-hidden="true" />
              MEET OUR MEDICAL TEAM
            </p>
            <h1>
              Experienced care.
              <br />
              <span>Focused on you.</span>
            </h1>
            <p className="doctor-hero-description">
              Connect with a doctor who understands your needs. Explore our
              specialties, compare care locations, and take the next step with
              confidence.
            </p>
            <a className="doctor-hero-link" href="#doctor-list">
              Browse available specialists <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a className="doctor-hero-assistant-link" href="#specialty-assistant">
              Find the right specialty for me <BrainCircuit size={16} aria-hidden="true" />
            </a>

            <div className="doctor-hero-stats" aria-label="Directory summary">
              <div>
                <strong>{doctors.length}</strong>
                <span>Doctors</span>
              </div>
              <div>
                <strong>{specialties.length}</strong>
                <span>Specialties</span>
              </div>
              <div>
                <strong>{hospitalCount}</strong>
                <span>Hospitals</span>
              </div>
            </div>
          </div>

          <div className="doctor-hero-visual" aria-hidden="true">
            <div className="doctor-hero-image-wrap">
              <img
                src={getDoctorPortrait(doctors[0]?.name) || "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=700"}
                alt=""
                className="doctor-hero-image"
              />
              <div className="doctor-hero-image-shade" />
              <div className="doctor-hero-note">
                <span className="doctor-hero-note-icon"><Stethoscope size={17} /></span>
                <span>
                  <strong>Care, with confidence</strong>
                  <small>Explore our medical team</small>
                </span>
              </div>
            </div>
            <span className="doctor-hero-orbit doctor-hero-orbit-one" />
            <span className="doctor-hero-orbit doctor-hero-orbit-two" />
          </div>
        </div>
      </section>

      <section className="specialty-assistant-section" id="specialty-assistant" aria-labelledby="specialty-assistant-title">
        <div className="specialty-assistant-card">
          <div className="specialty-assistant-heading">
            <span className="specialty-assistant-icon"><BrainCircuit size={23} aria-hidden="true" /></span>
            <div>
              <p className="doctor-eyebrow">SMART SPECIALIST FINDER</p>
              <h2 id="specialty-assistant-title">Not sure which specialist to see?</h2>
              <p>Describe what is bothering you. Get a private, symptom-based suggestion from our care guide.</p>
            </div>
          </div>
          <form className="specialty-assistant-form" onSubmit={findSpecialist}>
            <label className="visually-hidden" htmlFor="symptom-description">Describe your symptoms</label>
            <textarea
              id="symptom-description"
              value={symptomText}
              onChange={(event) => setSymptomText(event.target.value)}
              placeholder="For example: recurring headaches, itchy skin, fever and cough..."
              maxLength={500}
              rows={3}
            />
            <div className="specialty-assistant-prompts" aria-label="Example symptom topics">
              <span>Try:</span>
              {[
                ["Heart concerns", "heart palpitations"],
                ["Skin concerns", "itchy skin rash"],
                ["Headaches", "recurring headache"],
                ["Cold or fever", "fever and cough"],
              ].map(([label, symptoms]) => (
                <button
                  type="button"
                  key={label}
                  onClick={() => {
                    setSymptomText(symptoms);
                    setRecommendation(recommendSpecialty(symptoms));
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="specialty-assistant-form-footer">
              <small>Privacy-first symptom matching runs on this device. It does not send your text to an AI service.</small>
              <button type="submit" disabled={!symptomText.trim()}><Search size={16} aria-hidden="true" /> Suggest a specialist</button>
            </div>
          </form>
          {recommendation?.kind === "urgent" && (
            <div className="specialty-assistant-result is-urgent" role="alert">
              <AlertTriangle size={21} aria-hidden="true" />
              <div>
                <strong>Seek emergency help now</strong>
                <p>These symptoms may need urgent attention. Contact your local emergency number or go to the nearest emergency department. Do not wait for an appointment or rely on this tool.</p>
              </div>
            </div>
          )}
          {recommendation?.kind === "recommendation" && (
            <div className="specialty-assistant-result" role="status">
              <Stethoscope size={21} aria-hidden="true" />
              <div>
                <strong>A {recommendation.specialty} may be a starting point</strong>
                <p>This is general navigation, not a diagnosis. A qualified clinician can assess your symptoms and refer you if needed.</p>
                {recommendation.alternatives.length > 0 && (
                  <p>Other possible specialties: {recommendation.alternatives.join(", ")}.</p>
                )}
                <p className="specialty-assistant-doctor-count">
                  {getDoctorsForSpecialty(recommendation.specialty).length > 0
                    ? `${getDoctorsForSpecialty(recommendation.specialty).length} matching ${recommendation.specialty} ${getDoctorsForSpecialty(recommendation.specialty).length === 1 ? "doctor" : "doctors"} in the directory.`
                    : `No ${recommendation.specialty} is listed right now.`}
                </p>
                <button
                  type="button"
                  onClick={() => showRecommendedDoctors(recommendation.specialty)}
                >
                  {getDoctorsForSpecialty(recommendation.specialty).length > 0
                    ? `View ${recommendation.specialty} care team`
                    : "Browse all doctors"}
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
                {getDoctorsForSpecialty(recommendation.specialty).length === 0 && (
                  <small>There are currently no doctors with this specialty in the directory.</small>
                )}
              </div>
            </div>
          )}
          {recommendation?.kind === "unknown" && (
            <div className="specialty-assistant-result" role="status">
              <Stethoscope size={21} aria-hidden="true" />
              <div>
                <strong>I couldn’t match that description to a listed specialty</strong>
                <p>A General Physician can often help you decide what care to seek. If symptoms are severe or worsening, seek urgent care.</p>
                <button type="button" onClick={() => showRecommendedDoctors("General Physician")}>
                  Browse available doctors <ArrowRight size={15} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="doctor-list-section" id="doctor-list">
        <div className="doctor-list-heading">
          <div>
            <p className="doctor-eyebrow">CARE THAT CENTERS ON YOU</p>
            <h2>Find your specialist</h2>
            <p className="doctor-list-description">
              Browse our care team by name, specialty, or hospital.
            </p>
          </div>
          <span className="doctor-results-count">
            {filteredDoctors.length} {filteredDoctors.length === 1 ? "doctor" : "doctors"}
          </span>
        </div>

        <div className="doctor-filters">
          <label className="doctor-search">
            <Search size={18} aria-hidden="true" />
            <span className="visually-hidden">Search doctors, specialties, or hospitals</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search doctors, specialties, hospitals..."
            />
          </label>
          <label className="doctor-specialty-filter">
            <Stethoscope size={17} aria-hidden="true" />
            <span className="visually-hidden">Filter by specialty</span>
            <select
              value={specialty}
              onChange={(event) => setSpecialty(event.target.value)}
            >
              <option value="all">All specialties</option>
              {specialties.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>

        {filteredDoctors.length > 0 && (
          <>
              <p className="doctor-photo-note">
                Portraits are representative. Doctor names, specialties, and locations are provided by your care directory.
            </p>
            <div className="doctor-grid">
              {filteredDoctors.map((doctor) => (
                <article className="directory-doctor-card" key={doctor.id}>
                  <div className="directory-doctor-photo">
                    {getDoctorPortrait(doctor.name) && (
                      <img
                        src={getDoctorPortrait(doctor.name)}
                        alt=""
                        loading="lazy"
                        onError={(event) => event.currentTarget.classList.add("is-unavailable")}
                      />
                    )}
                    <span className="doctor-photo-fallback" aria-hidden="true">
                      {getDoctorInitials(doctor.name)}
                    </span>
                    <span className="doctor-specialty-tag">
                      <Stethoscope size={13} aria-hidden="true" />
                      {doctor.specialty || "Medical professional"}
                    </span>
                  </div>

                  <div className="directory-doctor-details">
                    <h3>{doctor.name}</h3>
                    <p className="directory-doctor-specialty">{doctor.specialty}</p>
                    <div className="directory-doctor-meta">
                      {doctor.hospital && (
                        <p><MapPin size={15} aria-hidden="true" /> {doctor.hospital}</p>
                      )}
                      {doctor.experience && (
                        <p><BriefcaseBusiness size={15} aria-hidden="true" /> {doctor.experience} experience</p>
                      )}
                    </div>
                    <button
                      className="directory-book-button"
                      type="button"
                      onClick={() => navigate(`/book/${doctor.id}`)}
                    >
                      Book an appointment <ArrowRight size={16} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {filteredDoctors.length === 0 && (
          <div className="doctor-state-card">
            <span className="doctor-state-icon"><Search size={22} /></span>
            <h3>No matching doctors</h3>
            <p>Try a different name or specialty, or clear your filters.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSpecialty("all");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default Doctors;
