from flask import Blueprint, jsonify, request
from database.conexion import get_db_connection, rows_to_list, row_to_dict

projects_bp = Blueprint("projects", __name__, url_prefix="/api")

# Imágenes por defecto representativas para que la UI de Figma siempre se vea atractiva
SECTOR_IMAGES = {
    "Agroindustria": "https://images.unsplash.com/photo-1787647561979-da6797612e4d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400",
    "Economía circular": "https://images.unsplash.com/photo-1787647561979-da6797612e4d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400",
    "Educación": "https://images.unsplash.com/photo-1758873272414-c0bf30332738?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400",
    "EdTech": "https://images.unsplash.com/photo-1758873272414-c0bf30332738?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400",
    "Fintech": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400",
    "Salud": "https://images.unsplash.com/photo-1758873267964-66a045a75e25?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400",
    "HealthTech": "https://images.unsplash.com/photo-1758873267964-66a045a75e25?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400",
    "Tecnología": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400"
}

def enriquecer_proyecto(p, conn):
    """Agrega relaciones (vacantes, habilidades requeridas, miembros y enlaces) a un proyecto."""
    p_dict = dict(p)
    proyecto_id = p_dict["id"]

    # Vacantes
    vacantes = conn.execute("""
        SELECT vp.id, vp.cubierta, h.nombre as habilidad_nombre, c.nombre as carrera_nombre
        FROM vacantes_proyecto vp
        LEFT JOIN habilidades h ON vp.habilidad_id = h.id
        LEFT JOIN carreras c ON vp.carrera_requerida_id = c.id
        WHERE vp.proyecto_id = ?
    """, (proyecto_id,)).fetchall()

    habilidades_necesarias = [v["habilidad_nombre"] for v in vacantes if v["habilidad_nombre"]]
    total_vacantes = len(vacantes)
    cubiertas = sum(1 for v in vacantes if v["cubierta"])

    # Miembros
    miembros = conn.execute("""
        SELECT mp.usuario_id, mp.rol_en_proyecto, mp.estado,
               u.nombres || ' ' || u.apellidos as nombre_completo,
               c.nombre as carrera
        FROM miembros_proyecto mp
        JOIN usuarios u ON mp.usuario_id = u.id
        LEFT JOIN carreras c ON u.carrera_id = c.id
        WHERE mp.proyecto_id = ? AND mp.estado = 'Activo'
    """, (proyecto_id,)).fetchall()

    total_miembros = len(miembros)
    p_dict["vacantes"] = rows_to_list(vacantes)
    p_dict["needs"] = habilidades_necesarias if habilidades_necesarias else ["Colaborador general"]
    p_dict["miembros"] = rows_to_list(miembros)
    p_dict["progress"] = f"{total_miembros} de {max(total_miembros + (total_vacantes - cubiertas), 3)} perfiles"
    p_dict["image"] = SECTOR_IMAGES.get(p_dict.get("sector"), SECTOR_IMAGES["Tecnología"])
    p_dict["category"] = p_dict.get("sector")
    p_dict["copy"] = p_dict.get("descripcion", "")
    p_dict["stage"] = p_dict.get("nivel_madurez", "Prototipo en desarrollo")
    
    # Obtener sala de chat
    sala = conn.execute("SELECT id, enlace_whatsapp FROM salas_chat WHERE proyecto_id = ?", (proyecto_id,)).fetchone()
    if sala:
        p_dict["sala_chat_id"] = sala["id"]
        p_dict["enlace_whatsapp"] = sala["enlace_whatsapp"]
    else:
        p_dict["sala_chat_id"] = None
        p_dict["enlace_whatsapp"] = None

    return p_dict


@projects_bp.route("/projects", methods=["GET"])
def get_projects():
    """Retorna la lista de proyectos publicados con soporte de filtros (CU-01)."""
    sector = request.args.get("sector")
    madurez = request.args.get("madurez")
    search = request.args.get("search", "").strip()

    conn = get_db_connection()
    query = """
        SELECT p.*, u.nombres || ' ' || u.apellidos as lider_nombre, u.correo_institucional as lider_correo
        FROM proyectos p
        JOIN usuarios u ON p.lider_id = u.id
        WHERE p.publicado = 1 AND p.estado = 'Activo'
    """
    params = []

    if sector:
        query += " AND p.sector = ?"
        params.append(sector)
    if madurez:
        query += " AND p.nivel_madurez = ?"
        params.append(madurez)
    if search:
        query += " AND (p.nombre LIKE ? OR p.descripcion LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%"])

    query += " ORDER BY p.fecha_creacion DESC"

    proyectos_raw = conn.execute(query, params).fetchall()
    proyectos = [enriquecer_proyecto(p, conn) for p in proyectos_raw]
    conn.close()

    return jsonify({"projects": proyectos, "total": len(proyectos)})


@projects_bp.route("/projects/<int:proyecto_id>", methods=["GET"])
def get_project(proyecto_id):
    """Retorna el detalle completo de un proyecto específico."""
    conn = get_db_connection()
    proyecto_raw = conn.execute("""
        SELECT p.*, u.nombres || ' ' || u.apellidos as lider_nombre, 
               u.correo_institucional as lider_correo, u.numero_celular as lider_celular,
               c.nombre as lider_carrera
        FROM proyectos p
        JOIN usuarios u ON p.lider_id = u.id
        LEFT JOIN carreras c ON u.carrera_id = c.id
        WHERE p.id = ?
    """, (proyecto_id,)).fetchone()

    if not proyecto_raw:
        conn.close()
        return jsonify({"error": "Proyecto no encontrado"}), 404

    proyecto = enriquecer_proyecto(proyecto_raw, conn)
    conn.close()

    return jsonify(proyecto)


@projects_bp.route("/projects", methods=["POST"])
def create_project():
    """Crea un nuevo proyecto con sus vacantes y sala de chat (CU-03 Emprende / Publicar)."""
    data = request.get_json() or {}
    lider_id = data.get("lider_id", 1) # Si no se envía, usa el usuario líder por defecto de la demo
    nombre = data.get("nombre", "").strip()
    sector = data.get("sector", "Tecnología").strip()
    descripcion = data.get("descripcion", "").strip()
    nivel_madurez = data.get("nivel_madurez", "Idea inicial").strip()
    habilidades_necesitadas = data.get("habilidades", [])

    if not nombre or not descripcion:
        return jsonify({"error": "El nombre y la descripción del proyecto son obligatorios"}), 400

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO proyectos (lider_id, nombre, sector, descripcion, nivel_madurez, publicado, estado)
            VALUES (?, ?, ?, ?, ?, 1, 'Activo')
        """, (lider_id, nombre, sector, descripcion, nivel_madurez))
        proyecto_id = cursor.lastrowid

        # Asignar al creador como miembro activo y líder
        cursor.execute("""
            INSERT INTO miembros_proyecto (proyecto_id, usuario_id, rol_en_proyecto, estado)
            VALUES (?, ?, 'Líder de Proyecto', 'Activo')
        """, (proyecto_id, lider_id))

        # Registrar las vacantes con las habilidades solicitadas
        for skill_nombre in habilidades_necesitadas:
            habilidad = conn.execute(
                "SELECT id FROM habilidades WHERE nombre = ?", (skill_nombre,)
            ).fetchone()

            if habilidad:
                habilidad_id = habilidad["id"]
            else:
                cursor.execute("INSERT INTO habilidades (nombre, tipo) VALUES (?, 'Dura')", (skill_nombre,))
                habilidad_id = cursor.lastrowid

            cursor.execute("""
                INSERT INTO vacantes_proyecto (proyecto_id, habilidad_id, cubierta)
                VALUES (?, ?, 0)
            """, (proyecto_id, habilidad_id))

        # Crear sala de chat oficial
        cursor.execute("""
            INSERT INTO salas_chat (proyecto_id)
            VALUES (?)
        """, (proyecto_id,))
        sala_chat_id = cursor.lastrowid

        # Mensaje de bienvenida inicial
        cursor.execute("""
            INSERT INTO mensajes_chat (sala_chat_id, remitente_id, contenido, es_mensaje_sistema)
            VALUES (?, NULL, ?, 1)
        """, (sala_chat_id, f"🎉 ¡Espacio de trabajo creado para '{nombre}'! Las personas invitadas se unirán aquí."))

        conn.commit()

        nuevo_proyecto = conn.execute("SELECT * FROM proyectos WHERE id = ?", (proyecto_id,)).fetchone()
        proyecto_enriquecido = enriquecer_proyecto(nuevo_proyecto, conn)
        conn.close()

        return jsonify({
            "status": "success",
            "message": "Proyecto publicado exitosamente",
            "project": proyecto_enriquecido
        }), 201

    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({"error": f"Error al crear proyecto: {str(e)}"}), 500


@projects_bp.route("/talento", methods=["GET"])
def get_talento():
    """
    Retorna la lista de talentos universitarios disponibles para Smart Matching (Descubrir y Socios).
    """
    carrera = request.args.get("carrera")
    habilidad = request.args.get("habilidad")
    search = request.args.get("search", "").strip()

    conn = get_db_connection()
    query = """
        SELECT u.id, u.nombres || ' ' || substr(u.apellidos, 1, 1) || '.' as name,
               u.nombres, u.apellidos, u.ciclo, u.correo_institucional, u.numero_celular,
               u.reputacion_promedio as rating, u.situacion_actual,
               c.nombre as career
        FROM usuarios u
        LEFT JOIN carreras c ON u.carrera_id = c.id
        WHERE u.perfil_completado = 1
    """
    params = []

    if carrera:
        query += " AND c.nombre LIKE ?"
        params.append(f"%{carrera}%")
    if search:
        query += " AND (u.nombres LIKE ? OR u.apellidos LIKE ? OR c.nombre LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])

    usuarios = conn.execute(query, params).fetchall()

    colores = ["coral", "violet", "mint", "amber", "lime"]
    talentos = []

    for index, u in enumerate(usuarios):
        u_dict = dict(u)
        user_id = u_dict["id"]

        # Habilidades del usuario
        skills = conn.execute("""
            SELECT h.nombre FROM habilidades h
            JOIN usuario_habilidades uh ON h.id = uh.habilidad_id
            WHERE uh.usuario_id = ?
        """, (user_id,)).fetchall()
        u_dict["skills"] = [s["nombre"] for s in skills]

        if habilidad and not any(habilidad.lower() in s.lower() for s in u_dict["skills"]):
            continue

        u_dict["cycle"] = f"{u_dict['ciclo']}º ciclo" if u_dict.get("ciclo") else "7º ciclo"
        u_dict["match"] = max(80, 98 - (index * 3))
        u_dict["color"] = colores[index % len(colores)]
        u_dict["availability"] = "Lun, mié y vie · Tardes" if index % 2 == 0 else "Mar y jue · Noches"
        talentos.append(u_dict)

    conn.close()
    return jsonify({"talento": talentos, "total": len(talentos)})