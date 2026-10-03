from flask import Flask
from routes.proyectos import projects_bp

app = Flask(__name__)
app.register_blueprint(projects_bp)

@app.route("/")
def home():
    return {
        "message": "NexusCampus Backend funcionando"
    }


if __name__ == "__main__":
    app.run(debug=True)