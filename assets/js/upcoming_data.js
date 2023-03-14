let diaActual = data.currentDate;
let eventos = data.events;
const filtroEventos = eventos.filter((dates) => dates.date > diaActual);
