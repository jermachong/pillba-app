export type Mode = "caregiver" | "patient";
export type Tab = "dashboard" | "schedule" | "logs";

export type Profile = {
  mode: Mode;
  name: string;
  initial: string;
  role: string;
  color: string;
};

export const PROFILES: Profile[] = [
  { mode: "caregiver", name: "Margaret H.", initial: "M", role: "Caregiver", color: "#FF5A36" },
  { mode: "patient",   name: "Eleanor B.",  initial: "E", role: "Patient",   color: "#2BBCB0" },
];

export const PILL_SLOTS = [
  { id: "A", name: "Metformin", count: 28, max: 30 },
  { id: "B", name: "Lisinopril", count: 2, max: 30 },
  { id: "C", name: "Atorvastatin", count: 22, max: 30 },
  { id: "D", name: "Amlodipine", count: 18, max: 30 },
  { id: "E", name: "Omeprazole", count: 1, max: 30 },
  { id: "F", name: "Vitamin D3", count: 25, max: 30 },
];

export const FLUID_SLOTS = [
  { id: "G", name: "Liquid Iron", volume: 12, maxVolume: 200, unit: "mL" },
  { id: "H", name: "K-Citrate", volume: 145, maxVolume: 200, unit: "mL" },
];

export const SCHEDULE = [
  { time: "8:00 AM", meds: ["Metformin 500mg", "Lisinopril 10mg"], status: "dispensed", next: false },
  { time: "12:00 PM", meds: ["Atorvastatin 20mg"], status: "upcoming", next: true },
  { time: "6:00 PM", meds: ["Metformin 500mg", "Amlodipine 5mg", "Omeprazole 20mg"], status: "upcoming", next: false },
  { time: "9:00 PM", meds: ["Vitamin D3 2000IU"], status: "upcoming", next: false },
];

export const EVENT_LOG = [
  { id: 1, ts: "Jul 9 · 08:00:14", med: "Metformin 500mg + Lisinopril 10mg", beam: 2, actual: "3.42g", expected: "3.40g", ok: true },
  { id: 2, ts: "Jul 8 · 18:01:03", med: "Metformin 500mg + Amlodipine 5mg", beam: 2, actual: "5.18g", expected: "5.20g", ok: true },
  { id: 3, ts: "Jul 8 · 08:00:09", med: "Metformin 500mg + Lisinopril 10mg", beam: 2, actual: "2.98g", expected: "3.40g", ok: false },
  { id: 4, ts: "Jul 7 · 21:00:22", med: "Vitamin D3 2000IU", beam: 1, actual: "0.82g", expected: "0.80g", ok: true },
];

export const INIT_CONTACTS = [
  { name: "Dr. Sarah Chen", relation: "Primary Physician", phone: "+1 (555) 234-7890" },
  { name: "Robert Barnes", relation: "Son / Emergency Contact", phone: "+1 (555) 891-2345" },
];

export type RootContext = {
  mode: Mode;
  patientPermission: boolean;
  setPatientPermission: (v: boolean) => void;
  connected: boolean;
  setConnected: (v: boolean) => void;
};
