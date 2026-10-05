import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "nexus.db")

def seed():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # 1. Carreras adicionales si no existen
    carreras = [
        (6, 'Ingeniería de Software', 'Desarrollo de sistemas, aplicaciones móviles y arquitecturas web'),
        (7, 'Derecho y Ciencias Políticas', 'Marco legal corporativo, propiedad intelectual y contratos'),
        (8, 'Agronomía', 'Producción agrícola, sostenibilidad, sensores y cultivos'),
        (9, 'Ciencias de la Comunicación', 'Comunicación estratégica, periodismo, relaciones públicas y medios')
    ]
    for cid, nom, desc in carreras:
        c.execute("INSERT OR IGNORE INTO carreras (id, nombre, descripcion) VALUES (?, ?, ?)", (cid, nom, desc))

    # 2. Habilidades adicionales enriquecidas
    habilidades = [
        ('Desarrollo Frontend React', 'Dura'),
        ('Backend Python y APIs', 'Dura'),
        ('Modelado Financiero y Pitch', 'Dura'),
        ('Optimización de Procesos Agro', 'Dura'),
        ('Análisis de Viabilidad Económica', 'Dura'),
        ('Diseño UI/UX en Figma', 'Dura'),
        ('Liderazgo y Gestión de Equipos', 'Blanda'),
        ('Comunicación Asertiva', 'Blanda'),
        ('Resolución Rápida de Conflictos', 'Blanda'),
        ('Adaptabilidad al Cambio', 'Blanda'),
        ('React', 'Dura'),
        ('HTML y CSS Tailwind', 'Dura'),
        ('JavaScript y TypeScript', 'Dura'),
        ('Desarrollo Web', 'Dura'),
        ('UX Research', 'Dura'),
        ('Branding y Prototipado', 'Dura'),
        ('Costos y Presupuestos', 'Dura'),
        ('Excel Avanzado', 'Dura'),
        ('Ventas B2B', 'Dura'),
        ('Estrategia Comercial', 'Dura'),
        ('Marketing Digital', 'Dura'),
        ('Storytelling y Pitch', 'Dura'),
        ('Sensores IoT y Telemetría', 'Dura'),
        ('Control de Calidad', 'Dura'),
        ('Propiedad Intelectual y Patentes', 'Dura'),
        ('Contratos y Acuerdos de Socios', 'Dura'),
        ('Bases de Datos y PostgreSQL', 'Dura'),
        ('Arquitectura Cloud', 'Dura'),
        ('Analítica de Datos', 'Dura'),
        ('Inteligencia Artificial y ML', 'Dura'),
        ('Python', 'Dura'),
        ('Finanzas', 'Dura'),
        ('Marketing', 'Dura'),
        ('Empatía', 'Blanda'),
        ('Trabajo en Equipo', 'Blanda'),
        ('Pensamiento Crítico', 'Blanda'),
        ('Organización y Planificación', 'Blanda')
    ]

    for nom, tipo in habilidades:
        c.execute("INSERT OR IGNORE INTO habilidades (nombre, tipo) VALUES (?, ?)", (nom, tipo))

    # Diccionario de nombre_habilidad -> id
    c.execute("SELECT id, nombre FROM habilidades")
    skill_map = {row[1]: row[0] for row in c.fetchall()}

    # 3. Usuarios de talento complementario y diverso
    nuevos_usuarios = [
        {
            "codigo": "0202114010",
            "correo": "asofia.ramos@unp.edu.pe",
            "nombres": "Ana Sofía",
            "apellidos": "Ramos Cruz",
            "carrera_id": 6, # Ing Software
            "ciclo": 8,
            "celular": "+51973111222",
            "situacion": "Busco equipo",
            "reputacion": 4.95,
            "skills": ["Desarrollo Frontend React", "React", "JavaScript y TypeScript", "Diseño UI/UX en Figma", "Trabajo en Equipo"]
        },
        {
            "codigo": "0202114011",
            "correo": "gtalledo@unp.edu.pe",
            "nombres": "Gabriel",
            "apellidos": "Talledo Benites",
            "carrera_id": 1, # Ing Informática
            "ciclo": 7,
            "celular": "+51973222333",
            "situacion": "Busco equipo",
            "reputacion": 4.85,
            "skills": ["Desarrollo Frontend React", "Desarrollo Web", "HTML y CSS Tailwind", "Resolución Rápida de Conflictos"]
        },
        {
            "codigo": "0202114012",
            "correo": "driveras@unp.edu.pe",
            "nombres": "Diego",
            "apellidos": "Rivera Soto",
            "carrera_id": 5, # Diseño Digital
            "ciclo": 8,
            "celular": "+51973333444",
            "situacion": "Busco equipo",
            "reputacion": 4.90,
            "skills": ["Diseño UI/UX en Figma", "UX Research", "Branding y Prototipado", "Empatía", "Comunicación Asertiva"]
        },
        {
            "codigo": "0202114013",
            "correo": "arojasc@unp.edu.pe",
            "nombres": "Ana",
            "apellidos": "Rojas Chunga",
            "carrera_id": 4, # Economía
            "ciclo": 8,
            "celular": "+51973444555",
            "situacion": "Busco equipo",
            "reputacion": 4.92,
            "skills": ["Análisis de Viabilidad Económica", "Costos y Presupuestos", "Finanzas", "Excel Avanzado", "Pensamiento Crítico"]
        },
        {
            "codigo": "0202114014",
            "correo": "mcastillov@unp.edu.pe",
            "nombres": "Mateo",
            "apellidos": "Castillo Vílchez",
            "carrera_id": 2, # Administración
            "ciclo": 7,
            "celular": "+51973555666",
            "situacion": "Busco equipo",
            "reputacion": 4.75,
            "skills": ["Ventas B2B", "Estrategia Comercial", "Modelado Financiero y Pitch", "Liderazgo y Gestión de Equipos"]
        },
        {
            "codigo": "0202114015",
            "correo": "vsilvap@unp.edu.pe",
            "nombres": "Valeria",
            "apellidos": "Silva Peña",
            "carrera_id": 9, # Ciencias de la Comunicación
            "ciclo": 6,
            "celular": "+51973666777",
            "situacion": "Busco equipo",
            "reputacion": 4.88,
            "skills": ["Marketing Digital", "Marketing", "Storytelling y Pitch", "Comunicación Asertiva"]
        },
        {
            "codigo": "0202114016",
            "correo": "jgarcias@unp.edu.pe",
            "nombres": "Jorge",
            "apellidos": "García Seminario",
            "carrera_id": 8, # Agronomía
            "ciclo": 9,
            "celular": "+51973777888",
            "situacion": "Busco equipo",
            "reputacion": 4.80,
            "skills": ["Optimización de Procesos Agro", "Sensores IoT y Telemetría", "Control de Calidad", "Adaptabilidad al Cambio"]
        },
        {
            "codigo": "0202114017",
            "correo": "vriosr@unp.edu.pe",
            "nombres": "Valeria",
            "apellidos": "Ríos Ramos",
            "carrera_id": 7, # Derecho
            "ciclo": 9,
            "celular": "+51973888999",
            "situacion": "Busco equipo",
            "reputacion": 4.85,
            "skills": ["Propiedad Intelectual y Patentes", "Contratos y Acuerdos de Socios", "Pensamiento Crítico", "Comunicación Asertiva"]
        },
        {
            "codigo": "0202114018",
            "correo": "dquispen@unp.edu.pe",
            "nombres": "Diego",
            "apellidos": "Quispe Navarro",
            "carrera_id": 1, # Ing Informática
            "ciclo": 8,
            "celular": "+51973999000",
            "situacion": "Busco equipo",
            "reputacion": 4.82,
            "skills": ["Backend Python y APIs", "Bases de Datos y PostgreSQL", "Arquitectura Cloud", "Python", "Organización y Planificación"]
        },
        {
            "codigo": "0202114019",
            "correo": "lmorales@unp.edu.pe",
            "nombres": "Lucía",
            "apellidos": "Morales Zapata",
            "carrera_id": 1, # Ing Informática
            "ciclo": 9,
            "celular": "+51973000999",
            "situacion": "Busco equipo",
            "reputacion": 4.95,
            "skills": ["Analítica de Datos", "Inteligencia Artificial y ML", "Python", "Backend Python y APIs", "Pensamiento Crítico"]
        }
    ]

    for u in nuevos_usuarios:
        c.execute("""
            INSERT OR IGNORE INTO usuarios (
                codigo_estudiante, correo_institucional, nombres, apellidos,
                carrera_id, ciclo, numero_celular, perfil_completado,
                terminos_y_condiciones, situacion_actual, reputacion_promedio
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?)
        """, (
            u["codigo"], u["correo"], u["nombres"], u["apellidos"],
            u["carrera_id"], u["ciclo"], u["celular"], u["situacion"], u["reputacion"]
        ))
        
        c.execute("SELECT id FROM usuarios WHERE codigo_estudiante = ?", (u["codigo"],))
        uid = c.fetchone()[0]

        for s_name in u["skills"]:
            sid = skill_map.get(s_name)
            if sid:
                c.execute("INSERT OR IGNORE INTO usuario_habilidades (usuario_id, habilidad_id) VALUES (?, ?)", (uid, sid))

    conn.commit()
    conn.close()
    print("[OK] Poblacion de estudiantes completada con exito.")

if __name__ == "__main__":
    seed()
