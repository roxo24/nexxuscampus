from flask import Flask

app = Flask(__name__)

@app.route("/salida")
def salir():
    return {
        "message": "Salida de la aplicación"
    }