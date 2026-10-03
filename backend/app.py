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
    app.run(debug=True, port=5001)