from flask import Blueprint, jsonify, request
from database.conexion import get_db_connection, rows_to_list, row_to_dict

solicitudes_bp = Blueprint("solicitudes", __name__, url_prefix="/api")

@solicitudes_bp.route("/solicitudes", methods=["POST"])
def enviar_solicitud():
    """
    Envía una solicitud de match o invitación para unirse a un proyecto (CU-01 / CU-02).
    Genera automáticamente una notificación para el usuario destinatario.
    """
    data = request.get_json() or {}
    remitente_id = data.get("remitente_id", 1)
    destinatario_id = data.get("destinatario_id")
    proyecto_id = data.get("proyecto_id")
    mensaje = data.get("mensaje", "Hola, me gustaría que colaboremos en este proyecto.")

    if not destinatario_id or not proyecto_id:
        return jsonify({"error": "destinatario_id y proyecto_id son obligatorios"}), 400

    conn = get_db_connection()
    try:
        # Obtener nombre del proyecto
        proyecto = conn.execute("SELECT nombre FROM proyectos WHERE id = ?", (proyecto_id,)).fetchone()
        proyecto_nombre = proyecto["nombre"] if proyecto else "un proyecto universitario"

        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO solicitudes_match (remitente_id, destinatario_id, proyecto_id, mensaje, estado)
            VALUES (?, ?, ?, ?, 'Pendiente')
        """, (remitente_id, destinatario_id, proyecto_id, mensaje))
        solicitud_id = cursor.lastrowid

        # Crear notificación para el destinatario
        cursor.execute("""
            INSERT INTO notificaciones (usuario_id, solicitud_id, titulo, mensaje, leida)
            VALUES (?, ?, ?, ?, 0)
        """, (
            destinatario_id,
            solicitud_id,
            "Nueva invitación de equipo",
            f"El proyecto '{proyecto_nombre}' te ha invitado a formar parte de su equipo."
        ))

        conn.commit()
        conn.close()

        return jsonify({
            "status": "success",
            "message": "Invitación enviada exitosamente",
            "solicitud_id": solicitud_id
        }), 201

    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({"error": f"Error al enviar invitación: {str(e)}"}), 500


@solicitudes_bp.route("/notificaciones/<int:usuario_id>", methods=["GET"])
def obtener_notificaciones(usuario_id):
    """Retorna las notificaciones e invitaciones recibidas por el estudiante."""
    conn = get_db_connection()
    notificaciones = conn.execute("""
        SELECT n.id, n.usuario_id, n.solicitud_id, n.titulo, n.mensaje, n.leida, n.fecha_creacion,
               sm.estado as solicitud_estado, sm.proyecto_id, sm.remitente_id,
               p.nombre as proyecto_nombre, p.sector as proyecto_sector
        FROM notificaciones n
        LEFT JOIN solicitudes_match sm ON n.solicitud_id = sm.id
        LEFT JOIN proyectos p ON sm.proyecto_id = p.id
        WHERE n.usuario_id = ?
        ORDER BY n.fecha_creacion DESC
    """, (usuario_id,)).fetchall()

    conn.close()
    return jsonify({"notificaciones": rows_to_list(notificaciones)})


@solicitudes_bp.route("/solicitudes/<int:solicitud_id>/responder", methods=["POST"])
def responder_solicitud(solicitud_id):
    """
    Acepta o rechaza una solicitud de match (CU-02).
    Si se acepta, agrega al estudiante como miembro del proyecto y publica el anuncio en el chat.
    """
    data = request.get_json() or {}
    accion = data.get("accion", "").lower().strip() # 'aceptar' o 'rechazar'

    if accion not in ["aceptar", "rechazar"]:
        return jsonify({"error": "La acción debe ser 'aceptar' o 'rechazar'"}), 400

    conn = get_db_connection()
    try:
        solicitud = conn.execute("""
            SELECT sm.*, p.nombre as proyecto_nombre,
                   u.nombres || ' ' || u.apellidos as nuevo_miembro_nombre
            FROM solicitudes_match sm
            JOIN proyectos p ON sm.proyecto_id = p.id
            JOIN usuarios u ON sm.destinatario_id = u.id
            WHERE sm.id = ?
        """, (solicitud_id,)).fetchone()

        if not solicitud:
            conn.close()
            return jsonify({"error": "Solicitud no encontrada"}), 404

        nuevo_estado = "Aceptada" if accion == "aceptar" else "Rechazada"
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE solicitudes_match 
            SET estado = ?, fecha_respuesta = CURRENT_TIMESTAMP
            WHERE id = ?
        """, (nuevo_estado, solicitud_id))

        # Marcar notificación como leída
        cursor.execute("UPDATE notificaciones SET leida = 1 WHERE solicitud_id = ?", (solicitud_id,))

        if accion == "aceptar":
            proyecto_id = solicitud["proyecto_id"]
            usuario_id = solicitud["destinatario_id"]
            nuevo_nombre = solicitud["nuevo_miembro_nombre"]
            proyecto_nombre = solicitud["proyecto_nombre"]

            # Incorporar como miembro formal
            cursor.execute("""
                INSERT OR IGNORE INTO miembros_proyecto (proyecto_id, usuario_id, rol_en_proyecto, estado)
                VALUES (?, ?, 'Colaborador de Equipo', 'Activo')
            """, (proyecto_id, usuario_id))

            # Notificar en la sala de chat
            sala = conn.execute("SELECT id FROM salas_chat WHERE proyecto_id = ?", (proyecto_id,)).fetchone()
            if sala:
                cursor.execute("""
                    INSERT INTO mensajes_chat (sala_chat_id, remitente_id, contenido, es_mensaje_sistema)
                    VALUES (?, NULL, ?, 1)
                """, (sala["id"], f"¡Equipo conectado con éxito! 🎉 Se ha unido {nuevo_nombre} a '{proyecto_nombre}'. ¡Comiencen a coordinar su primer hito aquí!"))

        conn.commit()
        conn.close()

        return jsonify({
            "status": "success",
            "message": f"Solicitud {nuevo_estado.lower()} con éxito",
            "estado": nuevo_estado
        })

    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({"error": f"Error al responder solicitud: {str(e)}"}), 500
