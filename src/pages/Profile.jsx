import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, Sparkles } from "lucide-react";
import axios from "axios";
import { authHeaders, getStoredUser } from "../api.js";
import "./Profile.css";

function readSavedProfile() {
  try {
    const profile = JSON.parse(localStorage.getItem("profile") || "{}");
    return profile && typeof profile === "object" ? profile : {};
  } catch {
    return {};
  }
}

function Profile() {
  const navigate = useNavigate();

  const [savedProfile] = useState(readSavedProfile);
  const [name, setName] = useState(() => savedProfile.name || "");
  const [email, setEmail] = useState(() => getStoredUser()?.email || savedProfile.email || "");
  const [phone, setPhone] = useState(() => savedProfile.phone || "");
  const [age, setAge] = useState(() => savedProfile.age || "");
  const [gender, setGender] = useState(() => savedProfile.gender || "");

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/login");
      return;
    }
    const userEmail = getStoredUser()?.email || savedProfile.email;
    if (!userEmail) {
      navigate("/login");
      return;
    }

    axios.get(`http://localhost:8080/api/users/profile?email=${encodeURIComponent(userEmail)}`, {
      headers: authHeaders(),
    })
      .then((res) => {
        if (res.data) {
          setName(res.data.name || "");
          setEmail(res.data.email || "");
          setPhone(res.data.phone || "");
          setAge(res.data.age ? String(res.data.age) : "");
          setGender(res.data.gender || "");
          localStorage.setItem("profile", JSON.stringify(res.data));
        }
      })
      .catch((err) => {
        console.warn("Could not fetch profile from backend, using localStorage:", err);
      });
  }, [navigate, savedProfile.email]);

  const handleSave = async (e) => {
    e.preventDefault();

    const profile = {
      name,
      email,
      phone,
      age: age ? parseInt(age, 10) : null,
      gender,
    };

    try {
      const response = await axios.put("http://localhost:8080/api/users/profile", profile, {
        headers: authHeaders(),
      });
      localStorage.setItem("profile", JSON.stringify(response.data || profile));
      alert("Profile updated successfully! ✅");
    } catch (err) {
      console.error("Could not update profile:", err);
      alert(err.response?.status === 401
        ? "Your session has expired. Please sign in again."
        : "Your profile could not be saved. Please try again.");
    }
  };

  return (
    <main className="profile-page">
      <section className="profile-card">
        <button
          className="profile-back"
          onClick={() => navigate("/dashboard")}
          type="button"
        >
          <ChevronLeft size={16} aria-hidden="true" /> Dashboard
        </button>

        <header className="profile-heading">
          <div className="profile-avatar" aria-hidden="true">
            {name.trim().charAt(0).toUpperCase() || "S"}
          </div>
          <div>
            <p className="profile-eyebrow">YOUR ACCOUNT</p>
            <h1>Personal profile</h1>
            <p className="profile-description">
              Keep your contact details up to date for a more connected care experience.
            </p>
          </div>
        </header>

        <form className="profile-form" onSubmit={handleSave}>
          <label htmlFor="profile-name">Full name</label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />

          <label htmlFor="profile-email">Email address</label>
          <input
            id="profile-email"
            type="email"
            value={email}
            readOnly
            placeholder="Enter your email"
          />
          <small>Your account email cannot be changed here.</small>

          <div className="profile-field-row">
            <div>
              <label htmlFor="profile-phone">Phone number</label>
              <input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label htmlFor="profile-age">Age</label>
              <input
                id="profile-age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age"
              />
            </div>
          </div>

          <label htmlFor="profile-gender">Gender</label>
          <select
            id="profile-gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>

          <div className="profile-form-footer">
            <p><Sparkles size={14} aria-hidden="true" /> Your profile is saved to your MediConnect account.</p>
            <button className="profile-save" type="submit">
              Save changes <ArrowUpRight size={16} aria-hidden="true" />
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
export default Profile;
