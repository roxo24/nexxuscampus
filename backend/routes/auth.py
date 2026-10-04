from flask import Blueprint, jsonify, request
from database.conexion import get_db_connection, rows_to_list, row_to_dict

auth_bp = Blueprint("auth", __name__, url_prefix="/api")

@auth_bp.route("/auth/estudiantes-unp", methods=["GET"])
def listar_estudiantes_unp():
    """Retorna los estudiantes registrados en la base académica UNP para pruebas/demo."""
    conn = get_db_connection()
    estudiantes = conn.execute("""
        SELECT codigo_estudiante, dni, nombres, apellidos, correo_institucional, 
               facultad, carrera, ciclo, estado_matricula 
        FROM estudiantes_unp
    """).fetchall()
    conn.close()
    return jsonify({"estudiantes": rows_to_list(estudiantes)})


@auth_bp.route("/auth/verificar-unp/<codigo>", methods=["GET"])
def verificar_estudiante_unp(codigo):
    """
    Verifica la identidad académica de un estudiante en la base de datos de la UNP.
    Permite validar por código de estudiante o correo institucional.
    """
    conn = get_db_connection()
    estudiante = conn.execute("""
        SELECT * FROM estudiantes_unp 
        WHERE codigo_estudiante = ? OR correo_institucional = ?
    """, (codigo, codigo)).fetchone()

    if not estudiante:
        conn.close()
        return jsonify({
            "error": "Estudiante no encontrado en el padrón institucional de la UNP"
        }), 404

    # Verificar si ya completó onboarding previamente en NexusCampus
    usuario_existente = conn.execute("""
        SELECT * FROM usuarios WHERE codigo_estudiante = ?
    """, (estudiante["codigo_estudiante"],)).fetchone()

    conn.close()

    return jsonify({
        "estudiante": row_to_dict(estudiante),
        "registrado_en_nexus": bool(usuario_existente),
        "usuario_id": usuario_existente["id"] if usuario_existente else None,
        "perfil_completado": bool(usuario_existente["perfil_completado"]) if usuario_existente else False
    })


@auth_bp.route("/auth/onboarding", methods=["POST"])
def completar_onboarding():
    """
    Registra o actualiza el perfil del estudiante en NexusCampus (CU-00).
    Asocia sus habilidades y opcionalmente crea su proyecto si seleccionó 'Tengo un proyecto'.
    """
    data = request.get_json() or {}
    codigo = data.get("codigo_estudiante", "").strip()
    correo = data.get("correo_institucional", "").strip()
    nombres = data.get("nombres", "").strip()
    apellidos = data.get("apellidos", "").strip()
    carrera_nombre = data.get("carrera", "").strip()
    carrera_id = data.get("carrera_id")
    ciclo = data.get("ciclo", 1)
    celular = data.get("numero_celular", "")
    terminos = 1 if data.get("terminos_y_condiciones") else 0
    situacion = data.get("situacion_actual", "Busco equipo")
    hard_skills = data.get("hard_skills", [])
    soft_skills = data.get("soft_skills", [])
    proyecto_info = data.get("proyecto")

    if not codigo or not correo or not nombres:
        return jsonify({"error": "Faltan campos obligatorios (código, correo o nombres)"}), 400

    conn = get_db_connection()
    try:
        # Resolver carrera_id si no vino directo
        if not carrera_id and carrera_nombre:
            carrera_row = conn.execute(
                "SELECT id FROM carreras WHERE nombre LIKE ?", (f"%{carrera_nombre}%",)
            ).fetchone()
            if carrera_row:
                carrera_id = carrera_row["id"]
            else:
                carrera_id = 1  # Carrera por defecto si no coincide

        # Verificar si el usuario ya existe
        usuario = conn.execute(
            "SELECT id FROM usuarios WHERE codigo_estudiante = ? OR correo_institucional = ?",
            (codigo, correo)
        ).fetchone()

        if usuario:
            usuario_id = usuario["id"]
            conn.execute("""
                UPDATE usuarios 
                SET nombres = ?, apellidos = ?, carrera_id = ?, ciclo = ?, 
                    numero_celular = ?, perfil_completado = 1, terminos_y_condiciones = ?,
                    situacion_actual = ?, fecha_actualizacion = CURRENT_TIMESTAMP
                WHERE id = ?
            """, (nombres, apellidos, carrera_id, ciclo, celular, terminos, situacion, usuario_id))
        else:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO usuarios (
                    codigo_estudiante, correo_institucional, nombres, apellidos,
                    carrera_id, ciclo, numero_celular, perfil_completado,
                    terminos_y_condiciones, situacion_actual, reputacion_promedio
                ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, 4.8)
            """, (codigo, correo, nombres, apellidos, carrera_id, ciclo, celular, terminos, situacion))
            usuario_id = cursor.lastrowid

        # Asociar habilidades seleccionadas (Hard + Soft)
        todas_las_skills = list(set(hard_skills + soft_skills))
        if todas_las_skills:
            # Limpiar habilidades previas
            conn.execute("DELETE FROM usuario_habilidades WHERE usuario_id = ?", (usuario_id,))
            for skill_nombre in todas_las_skills:
                # Buscar o insertar la habilidad en el catálogo
                habilidad = conn.execute(
                    "SELECT id FROM habilidades WHERE nombre = ?", (skill_nombre,)
                ).fetchone()
                if habilidad:
                    habilidad_id = habilidad["id"]
                else:
                    tipo = "Blanda" if skill_nombre in soft_skills else "Dura"
                    cur = conn.cursor()
                    cur.execute("INSERT INTO habilidades (nombre, tipo) VALUES (?, ?)", (skill_nombre, tipo))
                    habilidad_id = cur.lastrowid

                conn.execute("""
                    INSERT OR IGNORE INTO usuario_habilidades (usuario_id, habilidad_id)
                    VALUES (?, ?)
                """, (usuario_id, habilidad_id))

        nuevo_proyecto_id = None
        # Si seleccionó 'Tengo un proyecto' y envió los datos iniciales, creamos el proyecto
        if situacion == "Tengo un proyecto" and proyecto_info and proyecto_info.get("nombre"):
            cur_p = conn.cursor()
            cur_p.execute("""
                INSERT INTO proyectos (lider_id, nombre, sector, descripcion, nivel_madurez, publicado, estado)
                VALUES (?, ?, ?, ?, 'Idea inicial', 1, 'Activo')
            """, (
                usuario_id,
                proyecto_info.get("nombre"),
                proyecto_info.get("sector", "Tecnología"),
                proyecto_info.get("descripcion", "")
            ))
            nuevo_proyecto_id = cur_p.lastrowid

            # Agregar al usuario como líder en miembros_proyecto
            conn.execute("""
                INSERT INTO miembros_proyecto (proyecto_id, usuario_id, rol_en_proyecto, estado)
                VALUES (?, ?, 'Líder Fundador', 'Activo')
            """, (nuevo_proyecto_id, usuario_id))

            # Crear sala de chat para el proyecto
            conn.execute("""
                INSERT OR IGNORE INTO salas_chat (proyecto_id)
                VALUES (?)
            """, (nuevo_proyecto_id,))

            # Crear mensaje de bienvenida del sistema
            sala = conn.execute("SELECT id FROM salas_chat WHERE proyecto_id = ?", (nuevo_proyecto_id,)).fetchone()
            if sala:
                conn.execute("""
                    INSERT INTO mensajes_chat (sala_chat_id, remitente_id, contenido, es_mensaje_sistema)
                    VALUES (?, NULL, ?, 1)
                """, (sala["id"], f"🚀 ¡Bienvenido al chat de {proyecto_info.get('nombre')}! Aquí podrán coordinar sus avances."))

        conn.commit()

        # Obtener el usuario actualizado
        usuario_actualizado = conn.execute("""
            SELECT u.*, c.nombre as carrera_nombre 
            FROM usuarios u
            LEFT JOIN carreras c ON u.carrera_id = c.id
            WHERE u.id = ?
        """, (usuario_id,)).fetchone()

        conn.close()

        return jsonify({
            "status": "success",
            "message": "Onboarding completado con éxito",
            "usuario": row_to_dict(usuario_actualizado),
            "proyecto_id": nuevo_proyecto_id
        }), 201

    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({"error": f"Error al procesar el onboarding: {str(e)}"}), 500


@auth_bp.route("/auth/perfil/<int:usuario_id>", methods=["GET"])
def obtener_perfil(usuario_id):
    """Retorna el perfil completo de un usuario con sus habilidades y proyectos."""
    conn = get_db_connection()
    usuario = conn.execute("""
        SELECT u.*, c.nombre as carrera_nombre 
        FROM usuarios u
        LEFT JOIN carreras c ON u.carrera_id = c.id
        WHERE u.id = ?
    """, (usuario_id,)).fetchone()

    if not usuario:
        conn.close()
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Habilidades del usuario
    habilidades = conn.execute("""
        SELECT h.id, h.nombre, h.tipo 
        FROM habilidades h
        JOIN usuario_habilidades uh ON h.id = uh.habilidad_id
        WHERE uh.usuario_id = ?
    """, (usuario_id,)).fetchall()

    # Proyectos en los que participa
    proyectos = conn.execute("""
        SELECT p.id, p.nombre, p.sector, p.nivel_madurez, mp.rol_en_proyecto
        FROM proyectos p
        JOIN miembros_proyecto mp ON p.id = mp.proyecto_id
        WHERE mp.usuario_id = ? AND mp.estado = 'Activo'
    """, (usuario_id,)).fetchall()

    conn.close()

    return jsonify({
        "usuario": row_to_dict(usuario),
        "habilidades": rows_to_list(habilidades),
        "proyectos": rows_to_list(proyectos)
    })


@auth_bp.route("/catalogos", methods=["GET"])
def obtener_catalogos():
    """Retorna catálogos generales: carreras, habilidades y motivos de salida."""
    conn = get_db_connection()
    carreras = conn.execute("SELECT id, nombre, descripcion FROM carreras").fetchall()
    habilidades = conn.execute("SELECT id, nombre, tipo FROM habilidades").fetchall()
    motivos = conn.execute("SELECT id, nombre FROM motivos_salida").fetchall()
    conn.close()

    return jsonify({
        "carreras": rows_to_list(carreras),
        "habilidades": rows_to_list(habilidades),
        "motivos_salida": rows_to_list(motivos)
    })
