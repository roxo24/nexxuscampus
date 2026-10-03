import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASE = os.path.join(BASE_DIR, "database", "nexus.db")


def get_db_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection

if __name__ == "__main__":
    connection = get_db_connection()

    print("Conexión exitosa")

    tablas = connection.execute(
        "SELECT name FROM sqlite_master WHERE type='table'"
    ).fetchall()

    for tabla in tablas:
        print(tabla["name"])

    connection.close()