from flask import Flask
from flask_cors import CORS

from routes.proyectos import projects_bp

app = Flask(__name__)

CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:5173"}}
)

app.register_blueprint(projects_bp)

@app.route("/")
def home():
    return {"message": "NexusCampus Backend funcionando"}

if __name__ == "__main__":
<<<<<<< HEAD
    app.run(debug=True)

# backend/app.py
@app.route('/api/chat/<int:proyecto_id>/whatsapp', methods=['POST'])
def activar_whatsapp(proyecto_id):
    conn = get_db_connection()
    
    # 1. Enlace oficial generado para el equipo
    # (Para la demo puedes usar un link real de un grupo que crees en tu celular)
    link_whatsapp = f"https://chat.whatsapp.com/NexusUNP_{proyecto_id}"

    # 2. Guardar el enlace en la sala de chat
    conn.execute("""
        UPDATE salas_chat 
        SET enlace_whatsapp = ? 
        WHERE proyecto_id = ?
    """, (link_whatsapp, proyecto_id))

    # 3. Insertar el mensaje automático del sistema en el chat
    conn.execute("""
        INSERT INTO mensajes_chat (sala_chat_id, remitente_id, contenido, es_mensaje_sistema)
        VALUES (
            (SELECT id FROM salas_chat WHERE proyecto_id = ?),
            NULL,
            ?,
            1
        )
    """, (proyecto_id, f"📲 ¡Se ha creado el grupo oficial de WhatsApp! Únanse aquí: {link_whatsapp}"))

    conn.commit()
    conn.close()

    return jsonify({"status": "success", "enlace_whatsapp": link_whatsapp})
=======
    app.run(debug=True, port=5001)
>>>>>>> 9ec72e0b4b17b4d41a095e1e36b33a59a45fa601
