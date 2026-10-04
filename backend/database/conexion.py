import os
import sqlite3

# Ruta absoluta al archivo de base de datos SQLite
DB_PATH = os.path.join(os.path.dirname(__file__), "nexus.db")

def get_db_connection():
    """
    Establece y retorna una conexión con la base de datos SQLite nexus.db.
    Configura sqlite3.Row para acceder a columnas por nombre
    y habilita las claves foráneas (foreign keys).
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def rows_to_list(rows):
    """Convierte una lista de sqlite3.Row en una lista de diccionarios estándar."""
    return [dict(row) for row in rows] if rows else []

def row_to_dict(row):
    """Convierte una única fila sqlite3.Row en un diccionario estándar."""
    return dict(row) if row else None
