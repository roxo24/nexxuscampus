from flask import Blueprint, jsonify, request
from database.conexion import get_db_connection, rows_to_list, row_to_dict

salida_bp = Blueprint("salida", __name__, url_prefix="/api")

@salida_bp.route("/salida/motivos", methods=["GET"])
def obtener_motivos_salida():
    """Retorna el catálogo de motivos formales de salida del proyecto (CU-05)."""
    conn = get_db_connection()
    motivos = conn.execute("SELECT id, nombre FROM motivos_salida ORDER BY id ASC").fetchall()
    conn.close()
    return jsonify({"motivos": rows_to_list(motivos)})


@salida_bp.route("/salida", methods=["POST"])
def registrar_salida_proyecto():
    """
    Registra formalmente la salida o desvinculación de un estudiante de un proyecto (CU-05).
    Actualiza el estado de la membresía, libera la vacante y registra el feedback anónimo.
    """
    data = request.get_json() or {}
    proyecto_id = data.get("proyecto_id")
    usuario_id = data.get("usuario_id")
    motivo_id = data.get("motivo_salida_id")
    motivo_texto = data.get("motivo_texto")
    comentario = data.get("comentario_adicional", "")

    if not proyecto_id or not usuario_id:
        return jsonify({"error": "proyecto_id y usuario_id son obligatorios"}), 400

    conn = get_db_connection()
    try:
        # Si se envió motivo_texto en vez de ID, resolver el ID
        if not motivo_id and motivo_texto:
            row_motivo = conn.execute(
                "SELECT id FROM motivos_salida WHERE nombre LIKE ?", (f"%{motivo_texto}%",)
            ).fetchone()
            motivo_id = row_motivo["id"] if row_motivo else 1
        elif not motivo_id:
            motivo_id = 1

        cursor = conn.cursor()
        # Registrar en la tabla salidas_proyecto
        cursor.execute("""
            INSERT INTO salidas_proyecto (proyecto_id, usuario_id, motivo_salida_id, comentario_adicional)
            VALUES (?, ?, ?, ?)
        """, (proyecto_id, usuario_id, motivo_id, comentario))

        # Actualizar estado de membresía a 'Retirado'
        cursor.execute("""
            UPDATE miembros_proyecto 
            SET estado = 'Retirado' 
            WHERE proyecto_id = ? AND usuario_id = ?
        """, (proyecto_id, usuario_id))

        # Liberar la vacante si estaba asociada a este usuario
        cursor.execute("""
            UPDATE vacantes_proyecto 
            SET cubierta = 0, usuario_id = NULL 
            WHERE proyecto_id = ? AND usuario_id = ?
        """, (proyecto_id, usuario_id))

        # Notificar en la sala de chat del proyecto mediante mensaje de sistema
        sala = conn.execute("SELECT id FROM salas_chat WHERE proyecto_id = ?", (proyecto_id,)).fetchone()
        if sala:
            cursor.execute("""
                INSERT INTO mensajes_chat (sala_chat_id, remitente_id, contenido, es_mensaje_sistema)
                VALUES (?, NULL, ?, 1)
            """, (sala["id"], "ℹ️ Un integrante ha finalizado su participación en el equipo. La vacante se encuentra abierta nuevamente en el campus."))

        conn.commit()
        conn.close()

        return jsonify({
            "status": "success",
            "message": "Salida del proyecto registrada correctamente"
        }), 201

    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({"error": f"Error al procesar la salida: {str(e)}"}), 500
