const emergencyGroups = [
  ["chest pain", "severe chest pain", "chest pressure", "trouble breathing", "difficulty breathing", "shortness of breath", "cannot breathe", "can't breathe", "unconscious", "not waking", "severe bleeding", "heavy bleeding", "face drooping", "one sided weakness", "one-sided weakness", "sudden weakness", "tongue swelling", "throat swelling"],
  ["ఛాతి నొప్పి", "ఊపిరి ఆడటం లేదు", "స్పృహ కోల్పోయ", "తీవ్ర రక్తస్రావం"],
];

const specialtyGroups = [
  {
    specialty: "Cardiologist",
    terms: ["heart", "cardiac", "heartbeat", "palpitation", "palpitations", "irregular heartbeat", "blood pressure", "high bp", "low bp", "gunde", "gundello", "gunde noppi", "గుండె", "గుండె నొప్పి"],
  },
  {
    specialty: "Dermatologist",
    terms: ["skin", "rash", "itch", "itching", "acne", "pimple", "pimples", "eczema", "hair loss", "mole", "దద్దుర్లు", "చర్మం", "దురద"],
  },
  {
    specialty: "Neurologist",
    terms: ["headache", "migraine", "seizure", "seizures", "fits", "numbness", "tingling", "nerve", "tremor", "memory loss", "తలనొప్పి", "తల నొప్పి", "మూర్ఛ"],
  },
  {
    specialty: "General Physician",
    terms: ["fever", "cold", "cough", "sore throat", "stomach", "abdomen", "nausea", "vomiting", "diarrhea", "tired", "fatigue", "general checkup", "జ్వరం", "దగ్గు", "జలుబు", "కడుపు నొప్పి"],
  },
];

function includesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

export function recommendSpecialty(input) {
  const symptoms = input.trim().toLocaleLowerCase();
  if (!symptoms) return { kind: "empty" };

  if (emergencyGroups.some((group) => includesAny(symptoms, group))) {
    return { kind: "urgent" };
  }

  const matches = specialtyGroups
    .map(({ specialty, terms }) => ({
      specialty,
      score: terms.filter((term) => symptoms.includes(term)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((first, second) => second.score - first.score);

  if (matches.length === 0) return { kind: "unknown" };

  return {
    kind: "recommendation",
    specialty: matches[0].specialty,
    alternatives: matches.slice(1).map(({ specialty }) => specialty),
  };
}
