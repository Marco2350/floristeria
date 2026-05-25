/**
 * Single source of truth for business contact details.
 * Update values here — they propagate to footer, contact page, FAQ,
 * checkout pickup, etc.
 */

export const BUSINESS = {
  name: "Lirios Floristería",
  shortName: "Lirios",
  city: "El Progreso, Yoro",
  country: "Honduras",

  address: {
    line1: "Plaza Rosamanda, local 1",
    line2: "Carretera RN21, salida hacia Santa Rita",
    postalCode: "23201",
    cityFull: "El Progreso, Yoro",
    full: "Plaza Rosamanda, local 1, carretera RN21, salida hacia Santa Rita, 23201 El Progreso, Yoro",
    short: "Plaza Rosamanda, El Progreso",
  },

  phone: {
    display: "8750-2362",
    tel: "+50487502362",
    whatsapp: "+50487502362",
  },

  email: "hola@liriosfloristeria.hn",

  hours: {
    weekdays: { label: "Lunes a Sábado", range: "8:30 — 18:00" },
    sunday: { label: "Domingos", range: "10:00 — 16:00" },
    summary: "Lun–Sáb 8:30–18:00 · Dom 10:00–16:00",
  },

  social: {
    instagram: {
      handle: "@liriosfloristeriahn",
      url: "https://www.instagram.com/liriosfloristeriahn/",
    },
    facebook: {
      handle: "Lirios Floristería",
      url: "https://www.facebook.com/people/Lirios-Floristería/61563818806306/",
    },
  },

  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Plaza+Rosamanda+El+Progreso+Yoro",
} as const;
