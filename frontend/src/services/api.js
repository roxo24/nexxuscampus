// src/services/api.js
const API_URL = "http://localhost:5000/api";

export async function getTalento() {
const res = await fetch(`${API_URL}/talento`);
return await res.json();
}

export async function getProyectos() {
const res = await fetch(`${API_URL}/proyectos`);
return await res.json();
}