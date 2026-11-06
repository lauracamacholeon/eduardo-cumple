// ====== EDITA AQUÍ ======
export const EVENTO = {
  nombre: "Eduardo",
  edad: "1", // <- años que cumple
  fecha: new Date(2026, 10, 14, 15, 0, 0), // 14 nov 2026, 3:00 pm (mes 10 = noviembre)
  fechaTexto: "Sábado 14 de noviembre",
  hora: "3:00 pm",
  direccion: "Cra 22 #137 64",
  ciudad: "Bogotá",
  nota: "Llevar chaqueta",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Cra 22 #137 64, Bogotá"),
};

// WhatsApp que recibe las confirmaciones: código de país + número, sin + ni espacios.
// Ejemplo Colombia: '573001234567'
export const WHATSAPP = "573024442635";
