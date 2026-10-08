import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Doctors from "./pages/Doctors.jsx";
import BookAppointment from "./pages/BookAppointment.jsx";
import Appointments from "./pages/Appointments.jsx";
import MedicalRecords from "./pages/MedicalRecords.jsx";
import Profile from "./pages/Profile.jsx";
import AdminRecords from "./pages/AdminRecords.jsx";
import SharedMedicalRecords from "./pages/SharedMedicalRecords.jsx";
import PatientRecordEntry from "./pages/PatientRecordEntry.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/doctors" element={<Doctors />} />

      <Route path="/book/:id" element={<BookAppointment />} />

      <Route path="/appointments" element={<Appointments />} />

      <Route path="/medical-records" element={<MedicalRecords />} />

      <Route path="/shared-records" element={<SharedMedicalRecords />} />

      <Route path="/my-records/new" element={<PatientRecordEntry />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="/admin-records" element={<AdminRecords />} />
    </Routes>
  );
}

export default App;