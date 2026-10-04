const API_URL = "http://localhost:5001/api";

/**
 * Helper para solicitudes fetch con parseo de JSON y manejo de errores.
 */
async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `Error ${res.status}: ${res.statusText}`);
    }
    return data;
  } catch (error) {
    console.warn(`[NexusAPI] Fallo en ${endpoint}:`, error.message);
    throw error;
  }
}

// -------------------------------------------------------------
// 1. PROYECTOS Y VACANTES (CU-01, CU-03)
// -------------------------------------------------------------

export async function getProyectos(filters = {}) {
  const params = new URLSearchParams();
  if (filters.sector) params.append("sector", filters.sector);
  if (filters.madurez) params.append("madurez", filters.madurez);
  if (filters.search) params.append("search", filters.search);

  const query = params.toString() ? `?${params.toString()}` : "";
  const data = await request(`/projects${query}`);
  return data.projects || [];
}

export async function getProyecto(id) {
  return await request(`/projects/${id}`);
}

export async function crearProyecto(proyectoData) {
  return await request("/projects", {
    method: "POST",
    body: JSON.stringify(proyectoData)
  });
}

// -------------------------------------------------------------
// 2. TALENTO Y SMART MATCHING
// -------------------------------------------------------------

export async function getTalento(filters = {}) {
  const params = new URLSearchParams();
  if (filters.carrera) params.append("carrera", filters.carrera);
  if (filters.habilidad) params.append("habilidad", filters.habilidad);
  if (filters.search) params.append("search", filters.search);

  const query = params.toString() ? `?${params.toString()}` : "";
  const data = await request(`/talento${query}`);
  return data.talento || [];
}

// -------------------------------------------------------------
// 3. AUTENTICACIÓN, PADRÓN UNP Y ONBOARDING (CU-00)
// -------------------------------------------------------------

export async function getEstudiantesUNP() {
  const data = await request("/auth/estudiantes-unp");
  return data.estudiantes || [];
}

export async function verificarEstudianteUNP(codigo) {
  return await request(`/auth/verificar-unp/${encodeURIComponent(codigo)}`);
}

export async function completarOnboarding(onboardingData) {
  return await request("/auth/onboarding", {
    method: "POST",
    body: JSON.stringify(onboardingData)
  });
}

export async function getPerfil(usuarioId) {
  return await request(`/auth/perfil/${usuarioId}`);
}

export async function getCatalogos() {
  return await request("/catalogos");
}

// -------------------------------------------------------------
// 4. CHAT Y WHATSAPP OFICIAL (CU-06)
// -------------------------------------------------------------

export async function getSalasChat(usuarioId = 1) {
  const data = await request(`/chat/salas/${usuarioId}`);
  return data.salas || [];
}

export async function getMensajesProyecto(proyectoId) {
  return await request(`/chat/${proyectoId}/mensajes`);
}

export async function enviarMensajeChat(proyectoId, remitenteId, contenido) {
  return await request(`/chat/${proyectoId}/mensajes`, {
    method: "POST",
    body: JSON.stringify({
      remitente_id: remitenteId,
      contenido: contenido
    })
  });
}

export async function activarWhatsApp(proyectoId, enlacePersonalizado = null) {
  return await request(`/chat/${proyectoId}/whatsapp`, {
    method: "POST",
    body: JSON.stringify({
      enlace_whatsapp: enlacePersonalizado
    })
  });
}

// -------------------------------------------------------------
// 5. SOLICITUDES DE MATCH Y NOTIFICACIONES (CU-01, CU-02)
// -------------------------------------------------------------

export async function enviarSolicitudMatch(remitenteId, destinatarioId, proyectoId, mensaje) {
  return await request("/solicitudes", {
    method: "POST",
    body: JSON.stringify({
      remitente_id: remitenteId,
      destinatario_id: destinatarioId,
      proyecto_id: proyectoId,
      mensaje: mensaje
    })
  });
}

export async function getNotificaciones(usuarioId = 1) {
  const data = await request(`/notificaciones/${usuarioId}`);
  return data.notificaciones || [];
}

export async function responderSolicitud(solicitudId, accion) {
  return await request(`/solicitudes/${solicitudId}/responder`, {
    method: "POST",
    body: JSON.stringify({ accion })
  });
}

// -------------------------------------------------------------
// 6. MOTIVOS DE SALIDA Y OFFBOARDING (CU-05)
// -------------------------------------------------------------

export async function getMotivosSalida() {
  const data = await request("/salida/motivos");
  return data.motivos || [];
}

export async function registrarSalidaProyecto(proyectoId, usuarioId, motivoId, comentario = "") {
  return await request("/salida", {
    method: "POST",
    body: JSON.stringify({
      proyecto_id: proyectoId,
      usuario_id: usuarioId,
      motivo_salida_id: motivoId,
      comentario_adicional: comentario
    })
  });
}