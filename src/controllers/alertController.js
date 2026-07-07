


import Product from "../models/Product.js";
import Appointment from "../models/Appointment.js";

// Formatea una fecha a un texto relativo simple, ej: "Hace 2 horas"
function tiempoRelativo(fecha) {
  const ahora = new Date();
  const diffMs = ahora - new Date(fecha);
  const minutos = Math.floor(diffMs / 60000);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  if (minutos < 1) return "Recién";
  if (minutos < 60) return `Hace ${minutos} min`;
  if (horas < 24) return `Hace ${horas} ${horas === 1 ? "hora" : "horas"}`;
  if (dias === 1) return "Ayer";
  return `Hace ${dias} días`;
}

export const getAlerts = async (req, res) => {
  try {
    const alerts = [];
    let idCounter = 1;

    // ===== ALERTAS DE STOCK =====
    const productos = await Product.find();

    productos.forEach((p) => {
      const umbralCritico = p.minStock / 2;

      if (p.quantity <= umbralCritico) {
        alerts.push({
          id: idCounter++,
          icon: "🚨",
          type: "critical",
          title: "Stock crítico",
          message: `${p.name} - Solo ${p.quantity} unidades disponibles`,
          time: tiempoRelativo(p.updatedAt),
          _sort: p.updatedAt,
        });
      } else if (p.quantity <= p.minStock) {
        alerts.push({
          id: idCounter++,
          icon: "⚠️",
          type: "warning",
          title: "Stock bajo",
          message: `${p.name} - ${p.quantity}/${p.minStock} unidades`,
          time: tiempoRelativo(p.updatedAt),
          _sort: p.updatedAt,
        });
      }
    });

    // ===== ALERTAS DE CITAS PENDIENTES =====
    const citasPendientes = await Appointment.find({ status: "pendiente" })
      .populate("pet", "name")
      .populate("owner", "name");

    const hoyStr = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    citasPendientes.forEach((cita) => {
      const nombreMascota = cita.pet?.name || "Mascota";
      const nombreDueño = cita.owner?.name || "Dueño";

      if (cita.date < hoyStr) {
        // Cita pendiente cuya fecha ya pasó → atrasada
        alerts.push({
          id: idCounter++,
          icon: "📞",
          type: "warning",
          title: "Seguimiento requerido",
          message: `${nombreMascota} - Cita del ${cita.date} sigue pendiente, contactar a ${nombreDueño}`,
          time: tiempoRelativo(cita.createdAt),
          _sort: cita.createdAt,
        });
      } else if (cita.date === hoyStr) {
        // Cita pendiente para hoy
        alerts.push({
          id: idCounter++,
          icon: "ℹ️",
          type: "info",
          title: "Cita pendiente hoy",
          message: `${nombreMascota} (${nombreDueño}) - Hoy a las ${cita.time}, motivo: ${cita.reason}`,
          time: "Hoy",
          _sort: cita.createdAt,
        });
      }
    });

    // Ordenar: críticas primero, luego warnings, luego info, más recientes primero
    const orden = { critical: 0, warning: 1, info: 2, success: 3 };
    alerts.sort((a, b) => orden[a.type] - orden[b.type] || new Date(b._sort) - new Date(a._sort));

    // Sacar el campo interno _sort antes de responder
    const alertsLimpias = alerts.map(({ _sort, ...rest }) => rest);

    res.json(alertsLimpias);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener alertas", error: error.message });
  }
};