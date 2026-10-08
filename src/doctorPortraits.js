export const defaultDoctors = [
  { id: 1, name: "Dr. Anjali Sharma", specialty: "Cardiologist", hospital: "Apollo Hospital", experience: "10 years" },
  { id: 2, name: "Dr. Rahul Kumar", specialty: "Dermatologist", hospital: "Yashoda Hospital", experience: "8 years" },
  { id: 3, name: "Dr. Priya Reddy", specialty: "General Physician", hospital: "KIMS Hospital", experience: "7 years" },
  { id: 4, name: "Dr. Arjun Rao", specialty: "Neurologist", hospital: "CARE Hospital", experience: "12 years" },
];

const portraitsByDoctor = {
  "dr. anjali sharma":
    "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=700",
  "dr. rahul kumar":
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=700&q=80",
  "dr. priya reddy":
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=700&q=80",
  "dr. arjun rao":
    "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?auto=format&fit=crop&w=700&q=80",
};

export function getDoctorPortrait(name) {
  return portraitsByDoctor[name?.trim().toLowerCase()] || "";
}

export function getDoctorInitials(name = "") {
  return name
    .replace(/^Dr\.?\s*/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
