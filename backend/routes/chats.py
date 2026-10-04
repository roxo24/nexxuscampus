from flask import Blueprint, jsonify, request
from database.conexion import get_db_connection, rows_to_list, row_to_dict

chats_bp = Blueprint("chats", __name__, url_prefix="/api")

@chats_bp.route("/chat/salas/<int:usuario_id>", methods=["GET"])
def obtener_salas_usuario(usuario_id):
    """
    Retorna todas las salas de chat de los proyectos en los que el usuario es líder o miembro.
    """
    conn = get_db_connection()
    salas = conn.execute("""
        SELECT DISTINCT sc.id as sala_id, sc.proyecto_id, sc.enlace_whatsapp,
               p.nombre as proyecto_nombre, p.sector
        FROM salas_chat sc
        JOIN proyectos p ON sc.proyecto_id = p.id
        LEFT JOIN miembros_proyecto mp ON p.id = mp.proyecto_id
        WHERE p.lider_id = ? OR (mp.usuario_id = ? AND mp.estado = 'Activo')
    """, (usuario_id, usuario_id)).fetchall()

    resultado = []
    for s in salas:
        s_dict = dict(s)
        # Último mensaje en la sala
        ultimo = conn.execute("""
            SELECT contenido, fecha_envio, es_mensaje_sistema,
                   u.nombres as remitente_nombre
            FROM mensajes_chat mc
            LEFT JOIN usuarios u ON mc.remitente_id = u.id
            WHERE mc.sala_chat_id = ?
            ORDER BY mc.fecha_envio DESC LIMIT 1
        """, (s_dict["sala_id"],)).fetchone()

        if ultimo:
            s_dict["ultimo_mensaje"] = ultimo["contenido"]
            s_dict["ultimo_remitente"] = "Sistema" if ultimo["es_mensaje_sistema"] else ultimo["remitente_nombre"]
            s_dict["fecha_ultimo_mensaje"] = ultimo["fecha_envio"]
        else:
            s_dict["ultimo_mensaje"] = "Sala de chat iniciada"
            s_dict["ultimo_remitente"] = "NexusCampus"
            s_dict["fecha_ultimo_mensaje"] = "Ahora"

        resultado.append(s_dict)

    conn.close()
    return jsonify({"salas": resultado})


@chats_bp.route("/chat/<int:proyecto_id>/mensajes", methods=["GET"])
def obtener_mensajes_proyecto(proyecto_id):
    """Retorna el historial de mensajes de la sala de un proyecto y su enlace de WhatsApp."""
    conn = get_db_connection()
    sala = conn.execute("SELECT id, enlace_whatsapp FROM salas_chat WHERE proyecto_id = ?", (proyecto_id,)).fetchone()

    if not sala:
        # Si la sala no existe, la creamos automáticamente
        cur = conn.cursor()
        cur.execute("INSERT INTO salas_chat (proyecto_id) VALUES (?)", (proyecto_id,))
        conn.commit()
        sala = conn.execute("SELECT id, enlace_whatsapp FROM salas_chat WHERE id = ?", (cur.lastrowid,)).fetchone()

    sala_id = sala["id"]
    mensajes = conn.execute("""
        SELECT mc.id, mc.remitente_id, mc.contenido, mc.es_mensaje_sistema, mc.fecha_envio,
               u.nombres || ' ' || substr(u.apellidos, 1, 1) || '.' as remitente_nombre
        FROM mensajes_chat mc
        LEFT JOIN usuarios u ON mc.remitente_id = u.id
        WHERE mc.sala_chat_id = ?
        ORDER BY mc.fecha_envio ASC
    """, (sala_id,)).fetchall()

    conn.close()

    return jsonify({
        "sala_id": sala_id,
        "proyecto_id": proyecto_id,
        "enlace_whatsapp": sala["enlace_whatsapp"],
        "mensajes": rows_to_list(mensajes)
    })


@chats_bp.route("/chat/<int:proyecto_id>/mensajes", methods=["POST"])
def enviar_mensaje(proyecto_id):
    """Envía un mensaje a la sala de chat del proyecto."""
    data = request.get_json() or {}
    remitente_id = data.get("remitente_id")
    contenido = data.get("contenido", "").strip()

    if not contenido:
        return jsonify({"error": "El contenido del mensaje no puede estar vacío"}), 400

    conn = get_db_connection()
    sala = conn.execute("SELECT id FROM salas_chat WHERE proyecto_id = ?", (proyecto_id,)).fetchone()
    if not sala:
        cur = conn.cursor()
        cur.execute("INSERT INTO salas_chat (proyecto_id) VALUES (?)", (proyecto_id,))
        sala_id = cur.lastrowid
    else:
        sala_id = sala["id"]

    cur = conn.cursor()
    cur.execute("""
        INSERT INTO mensajes_chat (sala_chat_id, remitente_id, contenido, es_mensaje_sistema)
        VALUES (?, ?, ?, 0)
    """, (sala_id, remitente_id, contenido))
    mensaje_id = cur.lastrowid
    conn.commit()

    nuevo_mensaje = conn.execute("""
        SELECT mc.*, u.nombres || ' ' || substr(u.apellidos, 1, 1) || '.' as remitente_nombre
        FROM mensajes_chat mc
        LEFT JOIN usuarios u ON mc.remitente_id = u.id
        WHERE mc.id = ?
    """, (mensaje_id,)).fetchone()

    conn.close()

    return jsonify({
        "status": "success",
        "mensaje": row_to_dict(nuevo_mensaje)
    }), 201


@chats_bp.route("/chat/<int:proyecto_id>/whatsapp", methods=["POST"])
def activar_whatsapp(proyecto_id):
    """
    Genera o actualiza el enlace oficial de WhatsApp para el equipo del proyecto
    e inserta un mensaje de notificación del sistema en el chat (CU-06).
    """
    data = request.get_json() or {}
    link_whatsapp = data.get("enlace_whatsapp") or f"https://chat.whatsapp.com/NexusUNP_P{proyecto_id}"

    conn = get_db_connection()
    sala = conn.execute("SELECT id FROM salas_chat WHERE proyecto_id = ?", (proyecto_id,)).fetchone()

    if not sala:
        cur = conn.cursor()
        cur.execute("INSERT INTO salas_chat (proyecto_id, enlace_whatsapp) VALUES (?, ?)", (proyecto_id, link_whatsapp))
        sala_id = cur.lastrowid
    else:
        sala_id = sala["id"]
        conn.execute("""
            UPDATE salas_chat 
            SET enlace_whatsapp = ? 
            WHERE id = ?
        """, (link_whatsapp, sala_id))

    # Insertar el mensaje automático del sistema en el chat
    conn.execute("""
        INSERT INTO mensajes_chat (sala_chat_id, remitente_id, contenido, es_mensaje_sistema)
        VALUES (?, NULL, ?, 1)
    """, (sala_id, f"📲 ¡Se ha creado el grupo oficial de WhatsApp! Únanse aquí: {link_whatsapp}"))

    conn.commit()
    conn.close()

    return jsonify({
        "status": "success",
        "message": "Enlace de WhatsApp activado con éxito",
        "enlace_whatsapp": link_whatsapp
    })
