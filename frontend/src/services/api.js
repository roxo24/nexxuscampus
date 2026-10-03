const API_URL = "http://localhost:5001/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al comunicarse con el backend");
  }

  return data;
}

export async function getProyectos(filters = {}) {
  const params = new URLSearchParams();

  if (filters.sector) params.set("sector", filters.sector);
  if (filters.nivel_madurez) params.set("nivel_madurez", filters.nivel_madurez);

  const query = params.toString();
  return request(`/projects${query ? `?${query}` : ""}`);
}

export async function getProyecto(projectId) {
  return request(`/projects/${projectId}`);
}

export async function getTalento() {
  return request("/talento");
}
