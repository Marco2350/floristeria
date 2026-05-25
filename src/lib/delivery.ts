export type DeliveryZone = {
  id: string;
  label: string;
  description: string;
  price: number;
  estimate: string;
};

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: "local",
    label: "El Progreso (centro y colonias)",
    description: "Mismo día si pides antes de las 14:00.",
    price: 80,
    estimate: "1–3 hrs",
  },
  {
    id: "santa-rita",
    label: "Santa Rita y alrededores",
    description: "Entrega el mismo día o al siguiente.",
    price: 120,
    estimate: "3–5 hrs",
  },
  {
    id: "yoro",
    label: "Resto del departamento de Yoro",
    description: "Entrega el mismo día o al siguiente.",
    price: 150,
    estimate: "3–6 hrs",
  },
  {
    id: "sps",
    label: "San Pedro Sula y zona metropolitana",
    description: "Entrega 24–48 hrs.",
    price: 200,
    estimate: "24–48 hrs",
  },
];

export const TIME_SLOTS = [
  { id: "morning", label: "Mañana", range: "09:00 — 13:00" },
  { id: "noon", label: "Mediodía", range: "13:00 — 17:00" },
  { id: "evening", label: "Tarde", range: "17:00 — 21:00" },
];

export const SAME_DAY_CUTOFF_HOUR = 14;

/**
 * Returns array of next N selectable dates (YYYY-MM-DD).
 * Excludes today if past cutoff.
 */
export function getAvailableDates(count = 14): Date[] {
  const dates: Date[] = [];
  const now = new Date();
  const startToday = now.getHours() < SAME_DAY_CUTOFF_HOUR;
  for (let i = startToday ? 0 : 1; dates.length < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    d.setHours(0, 0, 0, 0);
    dates.push(d);
  }
  return dates;
}

export function formatYMD(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const DAY_NAMES_LONG = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];
const MONTH_NAMES = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

export function formatDateShort(d: Date): string {
  return `${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
}

export function formatDateLong(d: Date): string {
  return `${DAY_NAMES_LONG[d.getDay()]} ${d.getDate()} de ${MONTH_NAMES[d.getMonth()]}`;
}

export function isToday(d: Date): boolean {
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
}

export function isTomorrow(d: Date): boolean {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
}
