from flask import Blueprint, request
from database.conexion import get_db_connection

projects_bp = Blueprint("projects", __name__)


@projects_bp.route("/api/projects", methods=["GET"])
def get_projects():

    sector = request.args.get("sector")
    nivel_madurez = request.args.get("nivel_madurez")

    connection = get_db_connection()

    query = "SELECT * FROM proyectos WHERE 1=1"
    params = []

    if sector:
        query += " AND sector = ?"
        params.append(sector)

    if nivel_madurez:
        query += " AND nivel_madurez = ?"
        params.append(nivel_madurez)

    projects = connection.execute(query, params).fetchall()

    connection.close()

    return {
        "projects": [dict(project) for project in projects]
    }


@projects_bp.route("/api/projects/<int:project_id>", methods=["GET"])
def get_project(project_id):
    connection = get_db_connection()

    project = connection.execute(
        "SELECT * FROM proyectos WHERE id = ?",
        (project_id,)
    ).fetchone()

    if project is None:
        connection.close()
        return {"error": "Proyecto no encontrado"}, 404

    vacancies = connection.execute(
        "SELECT * FROM vacantes_proyecto WHERE proyecto_id = ?",
        (project_id,)
    ).fetchall()

    connection.close()

    project_data = dict(project)

    project_data["vacantes"] = [
        dict(vacancy) for vacancy in vacancies
    ]

    return project_data
