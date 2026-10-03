const API_URL = "http://localhost:5001/api";

export async function getProyectos() {
    const res = await fetch(`${API_URL}/projects`);

    if (!res.ok) {
        throw new Error("No se pudieron obtener los proyectos");
    }

    const data = await res.json();

    return data.projects;
}

export async function getProyecto(id) {
    const res = await fetch(`${API_URL}/projects/${id}`);

    if (!res.ok) {
        throw new Error("No se pudo obtener el proyecto");
    }

    return await res.json();
}