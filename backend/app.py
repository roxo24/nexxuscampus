import os
from flask import Flask, jsonify
from flask_cors import CORS

from routes.proyectos import projects_bp
from routes.auth import auth_bp
from routes.chats import chats_bp
from routes.salida import salida_bp
from routes.solicitudes import solicitudes_bp

app = Flask(__name__)

# Permitir solicitudes CORS desde el frontend Vite
CORS(
    app,
    resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}},
    supports_credentials=True
)

# Registro centralizado de Blueprints
app.register_blueprint(projects_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(chats_bp)
app.register_blueprint(salida_bp)
app.register_blueprint(solicitudes_bp)

@app.route("/")
def home():
    return jsonify({
        "status": "online",
        "app": "NexusCampus Backend API",
        "endpoints": {
            "proyectos": "/api/projects",
            "talento": "/api/talento",
            "catalogos": "/api/catalogos",
            "estudiantes_unp": "/api/auth/estudiantes-unp",
            "onboarding": "/api/auth/onboarding",
            "chats": "/api/chat/salas/<usuario_id>",
            "salida_motivos": "/api/salida/motivos",
            "solicitudes": "/api/solicitudes"
        }
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    print(f"🚀 Servidor NexusCampus ejecutándose en http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
