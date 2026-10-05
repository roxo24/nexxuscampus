import os
import re
import json
import unicodedata
from flask import Blueprint, jsonify, request
from database.conexion import get_db_connection, rows_to_list, row_to_dict

ai_bp = Blueprint("ai", __name__, url_prefix="/api/ai")

# Mapeo de disciplinas a dominios del ecosistema universitario
DOMINIOS = {
    "tech": {
        "carreras": ["Ingeniería de Software", "Ingeniería Informática"],
        "complementos": ["design", "business", "growth", "legal"],
        "terminos": ["web", "frontend", "backend", "react", "python", "api", "apis", "software", "programador", "codigo", "desarrollo", "base de datos", "datos", "data", "inteligencia artificial", "ia", "ml", "machine learning", "cloud", "servidor", "javascript", "typescript", "html", "css", "tailwind", "postgres", "sql", "nube"]
    },
    "design": {
        "carreras": ["Diseño Digital y Comunicación", "Diseño Digital"],
        "complementos": ["tech", "business", "growth"],
        "terminos": ["diseno", "ui", "ux", "figma", "prototipo", "prototipado", "interfaz", "interfaces", "experiencia de usuario", "branding", "marca", "pantalla", "pantallas", "wireframe", "investigacion de usuarios", "user research"]
    },
    "business": {
        "carreras": ["Administración de Empresas", "Economía"],
        "complementos": ["tech", "design", "growth", "legal"],
        "terminos": ["finanzas", "financiero", "costos", "costo", "presupuesto", "presupuestos", "viabilidad", "modelo de negocio", "pitch", "inversion", "inversionistas", "ventas", "b2b", "comercial", "precio", "rentabilidad", "excel", "economia", "negocio", "administracion"]
    },
    "growth": {
        "carreras": ["Ciencias de la Comunicación"],
        "complementos": ["tech", "design", "business"],
        "terminos": ["marketing", "marketing digital", "comunicacion", "storytelling", "redes", "redes sociales", "difusion", "prensa", "contenido", "oratoria", "publicidad", "campana"]
    },
    "agro": {
        "carreras": ["Agronomía", "Ingeniería Agroindustrial"],
        "complementos": ["tech", "business"],
        "terminos": ["agro", "agronomia", "agroindustrial", "agricultura", "cultivo", "cultivos", "campo", "sensores", "iot", "cosecha", "riego", "calidad", "telemetria"]
    },
    "legal": {
        "carreras": ["Derecho y Ciencias Políticas"],
        "complementos": ["business", "tech"],
        "terminos": ["legal", "derecho", "contrato", "contratos", "patente", "patentes", "propiedad intelectual", "socios", "estatutos", "acuerdo", "regulacion"]
    }
}

SEMANTIC_DICTIONARY = {
    # Web & Frontend
    "web": ["Desarrollo Frontend React", "Desarrollo Web", "HTML y CSS Tailwind", "JavaScript y TypeScript"],
    "pagina": ["Desarrollo Frontend React", "Desarrollo Web", "HTML y CSS Tailwind"],
    "paginas": ["Desarrollo Frontend React", "Desarrollo Web", "HTML y CSS Tailwind"],
    "frontend": ["Desarrollo Frontend React", "React", "HTML y CSS Tailwind", "JavaScript y TypeScript"],
    "react": ["Desarrollo Frontend React", "React", "JavaScript y TypeScript"],
    "tailwind": ["HTML y CSS Tailwind", "Desarrollo Frontend React"],
    "javascript": ["JavaScript y TypeScript", "Desarrollo Frontend React"],
    "typescript": ["JavaScript y TypeScript", "Desarrollo Frontend React"],
    "interfaz": ["Diseño UI/UX en Figma", "Desarrollo Frontend React"],
    "interfaces": ["Diseño UI/UX en Figma", "Desarrollo Frontend React"],
    "programador": ["Desarrollo Frontend React", "Backend Python y APIs", "Python"],
    "programadora": ["Desarrollo Frontend React", "Backend Python y APIs", "Python"],
    "desarrollador": ["Desarrollo Frontend React", "Backend Python y APIs", "Python"],
    "desarrollo": ["Desarrollo Frontend React", "Backend Python y APIs"],
    "software": ["Desarrollo Frontend React", "Backend Python y APIs", "Python"],
    "codigo": ["Desarrollo Frontend React", "Backend Python y APIs", "Python"],

    # Backend & Data & AI
    "backend": ["Backend Python y APIs", "Python", "Bases de Datos y PostgreSQL", "Arquitectura Cloud"],
    "api": ["Backend Python y APIs", "Python"],
    "apis": ["Backend Python y APIs", "Python"],
    "python": ["Backend Python y APIs", "Python", "Analítica de Datos", "Inteligencia Artificial y ML"],
    "base de datos": ["Bases de Datos y PostgreSQL", "Backend Python y APIs"],
    "datos": ["Analítica de Datos", "Inteligencia Artificial y ML", "Python"],
    "data": ["Analítica de Datos", "Inteligencia Artificial y ML", "Python"],
    "ia": ["Inteligencia Artificial y ML", "Analítica de Datos", "Python"],
    "inteligencia artificial": ["Inteligencia Artificial y ML", "Python"],
    "machine learning": ["Inteligencia Artificial y ML", "Python"],
    "cloud": ["Arquitectura Cloud", "Backend Python y APIs"],
    "nube": ["Arquitectura Cloud", "Backend Python y APIs"],

    # Design & UX
    "diseno": ["Diseño UI/UX en Figma", "UX Research", "Branding y Prototipado", "Diseño de producto"],
    "ux": ["UX Research", "Diseño UI/UX en Figma"],
    "ui": ["Diseño UI/UX en Figma", "UX Research"],
    "figma": ["Diseño UI/UX en Figma", "Branding y Prototipado"],
    "prototipo": ["Branding y Prototipado", "Diseño UI/UX en Figma"],
    "prototipado": ["Branding y Prototipado", "Diseño UI/UX en Figma"],
    "branding": ["Branding y Prototipado", "Diseño UI/UX en Figma"],
    "marca": ["Branding y Prototipado"],
    "pantalla": ["Diseño UI/UX en Figma", "Desarrollo Frontend React"],
    "pantallas": ["Diseño UI/UX en Figma", "Desarrollo Frontend React"],

    # Finance, Economy & Costs
    "costos": ["Costos y Presupuestos", "Análisis de Viabilidad Económica", "Finanzas", "Excel Avanzado"],
    "costo": ["Costos y Presupuestos", "Análisis de Viabilidad Económica", "Finanzas"],
    "presupuesto": ["Costos y Presupuestos", "Finanzas", "Excel Avanzado"],
    "presupuestos": ["Costos y Presupuestos", "Finanzas", "Excel Avanzado"],
    "precio": ["Costos y Presupuestos", "Finanzas", "Análisis de Viabilidad Económica"],
    "finanzas": ["Finanzas", "Costos y Presupuestos", "Modelado Financiero y Pitch", "Análisis de Viabilidad Económica"],
    "financiero": ["Finanzas", "Modelado Financiero y Pitch", "Costos y Presupuestos"],
    "viabilidad": ["Análisis de Viabilidad Económica", "Costos y Presupuestos"],
    "economia": ["Análisis de Viabilidad Económica", "Finanzas"],
    "excel": ["Excel Avanzado", "Costos y Presupuestos", "Finanzas"],

    # Business, Administration & Sales
    "negocio": ["Modelado Financiero y Pitch", "Estrategia Comercial", "Ventas B2B"],
    "pitch": ["Modelado Financiero y Pitch", "Storytelling y Pitch"],
    "inversion": ["Modelado Financiero y Pitch", "Finanzas", "Estrategia Comercial"],
    "inversionistas": ["Modelado Financiero y Pitch", "Storytelling y Pitch", "Finanzas"],
    "presentar": ["Modelado Financiero y Pitch", "Storytelling y Pitch", "Comunicación Asertiva"],
    "presentacion": ["Modelado Financiero y Pitch", "Storytelling y Pitch"],
    "ventas": ["Ventas B2B", "Estrategia Comercial"],
    "comercial": ["Estrategia Comercial", "Ventas B2B"],
    "clientes": ["Ventas B2B", "Estrategia Comercial"],

    # Marketing & Communication
    "marketing": ["Marketing", "Marketing Digital", "Storytelling y Pitch"],
    "redes": ["Marketing Digital", "Marketing"],
    "redes sociales": ["Marketing Digital", "Marketing"],
    "contenido": ["Marketing Digital", "Storytelling y Pitch"],
    "storytelling": ["Storytelling y Pitch", "Comunicación Asertiva"],
    "comunicacion": ["Comunicación Asertiva", "Storytelling y Pitch"],
    "prensa": ["Marketing Digital", "Comunicación Asertiva"],

    # Agro & Sensors
    "agro": ["Optimización de Procesos Agro", "Sensores IoT y Telemetría"],
    "agronomia": ["Optimización de Procesos Agro", "Sensores IoT y Telemetría", "Control de Calidad"],
    "campo": ["Optimización de Procesos Agro"],
    "cultivo": ["Optimización de Procesos Agro", "Control de Calidad"],
    "cultivos": ["Optimización de Procesos Agro", "Control de Calidad"],
    "sensores": ["Sensores IoT y Telemetría", "Optimización de Procesos Agro"],
    "iot": ["Sensores IoT y Telemetría"],
    "telemetria": ["Sensores IoT y Telemetría"],
    "calidad": ["Control de Calidad", "Optimización de Procesos Agro"],

    # Legal
    "legal": ["Contratos y Acuerdos de Socios", "Propiedad Intelectual y Patentes"],
    "derecho": ["Contratos y Acuerdos de Socios", "Propiedad Intelectual y Patentes"],
    "contrato": ["Contratos y Acuerdos de Socios"],
    "contratos": ["Contratos y Acuerdos de Socios"],
    "patente": ["Propiedad Intelectual y Patentes"],
    "patentes": ["Propiedad Intelectual y Patentes"],
    "propiedad intelectual": ["Propiedad Intelectual y Patentes"]
}

def normalizar(texto):
    """Limpia tildes, signos y mayúsculas para comparaciones semánticas precisas."""
    if not texto:
        return ""
    s = unicodedata.normalize('NFD', str(texto))
    return "".join(c for c in s if unicodedata.category(c) != 'Mn').lower().strip()

def extraer_intenciones(texto):
    """Extrae habilidades inferidas y dominios temáticos de la consulta en lenguaje natural."""
    texto_norm = normalizar(texto)
    skills_inferidas = set()
    dominios_detectados = set()

    # Coincidencias con diccionario semántico
    for termino, skills in SEMANTIC_DICTIONARY.items():
        termino_norm = normalizar(termino)
        if re.search(r'\b' + re.escape(termino_norm) + r'\b', texto_norm) or termino_norm in texto_norm:
            for s in skills:
                skills_inferidas.add(s)

    # Coincidencias con dominios clave
    for dom_key, dom_data in DOMINIOS.items():
        for t in dom_data["terminos"]:
            t_norm = normalizar(t)
            if re.search(r'\b' + re.escape(t_norm) + r'\b', texto_norm) or t_norm in texto_norm:
                dominios_detectados.add(dom_key)
                break

    return list(skills_inferidas), list(dominios_detectados)

def generar_explicacion_ia(candidato, hard_skills_coincidentes, consulta_original):
    """Genera una explicación contextual personalizada sobre por qué este candidato es recomendado."""
    nombre = candidato.get("nombres") or candidato.get("name") or "El estudiante"
    carrera = candidato.get("career") or candidato.get("carrera_nombre") or "su carrera"
    
    if hard_skills_coincidentes:
        skills_str = " y ".join(hard_skills_coincidentes[:2])
        return (
            f"El perfil de {nombre} en {carrera} es ideal porque aporta experiencia directa en {skills_str}, "
            f"resolviendo con precisión lo que necesitas para tu siguiente hito."
        )
    else:
        primer_skill = candidato.get("skills", ["su especialidad"])[0] if candidato.get("skills") else "su disciplina"
        return (
            f"La formación de {nombre} en {carrera} y su dominio en {primer_skill} "
            f"aportan una perspectiva complementaria de alto valor para robustecer la ejecución de tu idea."
        )


@ai_bp.route("/buscar-por-descripcion", methods=["POST"])
def buscar_por_descripcion():
    """
    Motor de Búsqueda Asistida por IA (CU-01 / Descubrir Talento).
    Recibe una descripción en lenguaje natural (ej. 'Necesito validar costos y convertir los datos en un pitch'),
    infiere habilidades requeridas y clasifica a los candidatos estrictamente por relevancia semántica.
    Filtra los perfiles sin coincidencia para que las recomendaciones sean genuinas y diferenciadas.
    """
    data = request.get_json() or {}
    descripcion = data.get("descripcion", "").strip()

    if not descripcion:
        return jsonify({"error": "La descripción de búsqueda es requerida"}), 400

    skills_inferidas, dominios_detectados = extraer_intenciones(descripcion)
    texto_norm = normalizar(descripcion)

    conn = get_db_connection()
    usuarios_raw = conn.execute("""
        SELECT u.id, u.nombres || ' ' || substr(u.apellidos, 1, 1) || '.' as name,
               u.nombres, u.apellidos, u.ciclo, u.reputacion_promedio as rating,
               c.nombre as career, c.descripcion as carrera_desc
        FROM usuarios u
        LEFT JOIN carreras c ON u.carrera_id = c.id
        WHERE u.perfil_completado = 1
    """).fetchall()

    candidatos = []
    colores = ["coral", "violet", "mint", "amber", "lime"]

    for index, u in enumerate(usuarios_raw):
        u_dict = dict(u)
        user_id = u_dict["id"]

        # Habilidades del candidato
        skills_rows = conn.execute("""
            SELECT h.nombre, h.tipo 
            FROM habilidades h
            JOIN usuario_habilidades uh ON h.id = uh.habilidad_id
            WHERE uh.usuario_id = ?
        """, (user_id,)).fetchall()

        candidato_skills = [s["nombre"] for s in skills_rows]
        u_dict["skills"] = candidato_skills

        hard_coincidentes = []
        soft_coincidentes = []

        career_norm = normalizar(u_dict["career"] or "")
        career_matches_domain = False
        for dom in dominios_detectados:
            carreras_dom = [normalizar(cd) for cd in DOMINIOS[dom]["carreras"]]
            if any(cd in career_norm for cd in carreras_dom):
                career_matches_domain = True
                break

        for s_row in skills_rows:
            s_name = s_row["nombre"]
            s_norm = normalizar(s_name)
            s_tipo = s_row["tipo"]

            is_matched = False
            # ¿Está en las inferidas del diccionario?
            if any(normalizar(inf) in s_norm or s_norm in normalizar(inf) for inf in skills_inferidas):
                is_matched = True
            # ¿Aparece directamente en el texto de búsqueda?
            elif s_norm in texto_norm:
                is_matched = True
            else:
                tokens_s = [t for t in s_norm.split() if len(t) > 3]
                if any(t in texto_norm for t in tokens_s):
                    is_matched = True

            if is_matched:
                if s_tipo == "Dura":
                    hard_coincidentes.append(s_name)
                else:
                    soft_coincidentes.append(s_name)

        # FILTRO DE RELEVANCIA: Si no tiene ninguna habilidad técnica coincidente Y su carrera no es afín al dominio, excluir.
        if not hard_coincidentes and not career_matches_domain:
            continue

        # Puntuación calibrada de 65% a 98%
        score = 55.0

        if len(hard_coincidentes) == 1:
            score += 24.0
        elif len(hard_coincidentes) == 2:
            score += 34.0
        elif len(hard_coincidentes) >= 3:
            score += 39.0

        if career_matches_domain:
            score += 5.0

        if soft_coincidentes:
            score += 3.0

        # Bonificación por reputación (4.5 a 5.0)
        rating = float(u_dict.get("rating") or 4.5)
        score += (rating - 4.5) * 6.0

        final_match = min(98, max(65, int(round(score))))
        u_dict["match"] = final_match
        u_dict["matched_skills"] = hard_coincidentes if hard_coincidentes else (soft_coincidentes if soft_coincidentes else candidato_skills[:2])
        u_dict["cycle"] = f"{u_dict['ciclo']}º ciclo" if u_dict.get("ciclo") else "7º ciclo"
        u_dict["rating"] = round(rating, 2)
        u_dict["color"] = colores[index % len(colores)]
        u_dict["availability"] = "Lun, mié y vie · Tardes" if index % 2 == 0 else "Mar y jue · Noches"
        u_dict["ai_reason"] = generar_explicacion_ia(u_dict, hard_coincidentes, descripcion)

        candidatos.append(u_dict)

    conn.close()

    # Ordenar por afinidad estricta (puntuación match descendente, número de habilidades duras, reputación)
    candidatos.sort(key=lambda x: (x["match"], len(x.get("matched_skills", [])), x.get("rating", 0)), reverse=True)

    return jsonify({
        "status": "success",
        "consulta": descripcion,
        "habilidades_detectadas": skills_inferidas,
        "dominios_detectados": dominios_detectados,
        "total_coincidencias": len(candidatos),
        "talento": candidatos
    })


@ai_bp.route("/smart-match", methods=["POST"])
def smart_match_complementario():
    """
    Evalúa compatibilidad de habilidades complementarias entre un líder o estudiante y los demás candidatos.
    Premia activamente la multidisciplinariedad universitaria (Tech <-> Diseño <-> Negocios/Finanzas <-> Comunicación <-> Legal/Agro).
    """
    data = request.get_json() or {}
    lider_carrera = data.get("lider_carrera", "Ingeniería Informática")
    habilidades_necesarias = data.get("habilidades_necesarias", [])
    exclude_id = data.get("exclude_id")

    lider_dom = None
    lider_carrera_norm = normalizar(lider_carrera)
    for dom_key, dom_data in DOMINIOS.items():
        if any(normalizar(c) in lider_carrera_norm or lider_carrera_norm in normalizar(c) for c in dom_data["carreras"]):
            lider_dom = dom_key
            break

    conn = get_db_connection()
    usuarios_raw = conn.execute("""
        SELECT u.id, u.nombres || ' ' || substr(u.apellidos, 1, 1) || '.' as name,
               u.nombres, u.apellidos, u.ciclo, u.reputacion_promedio as rating,
               c.nombre as career
        FROM usuarios u
        LEFT JOIN carreras c ON u.carrera_id = c.id
        WHERE u.perfil_completado = 1
    """).fetchall()

    resultados = []
    colores = ["coral", "violet", "mint", "amber", "lime"]

    for idx, u in enumerate(usuarios_raw):
        u_dict = dict(u)
        user_id = u_dict["id"]

        # No recomendarse a uno mismo
        if exclude_id and user_id == exclude_id:
            continue

        skills_rows = conn.execute("""
            SELECT h.nombre, h.tipo FROM habilidades h
            JOIN usuario_habilidades uh ON h.id = uh.habilidad_id
            WHERE uh.usuario_id = ?
        """, (user_id,)).fetchall()
        candidato_skills = [s["nombre"] for s in skills_rows]
        u_dict["skills"] = candidato_skills

        # Identificar dominio del candidato
        cand_career_norm = normalizar(u_dict["career"] or "")
        cand_dom = None
        for dom_key, dom_data in DOMINIOS.items():
            if any(normalizar(cd) in cand_career_norm or cand_career_norm in normalizar(cd) for cd in dom_data["carreras"]):
                cand_dom = dom_key
                break

        score = 65.0

        # Sinergia complementaria entre dominios
        if lider_dom and cand_dom:
            if cand_dom in DOMINIOS[lider_dom]["complementos"]:
                score += 22.0
                if cand_dom == "design":
                    score += 4.0
                elif cand_dom == "business":
                    score += 3.0
            elif cand_dom == lider_dom:
                score += 5.0
            else:
                score += 10.0
        elif cand_career_norm != lider_carrera_norm:
            score += 15.0

        # Coincidencia con vacantes o habilidades solicitadas
        matched_needed = []
        for s in candidato_skills:
            if any(normalizar(s) in normalizar(nec) or normalizar(nec) in normalizar(s) for nec in habilidades_necesarias):
                matched_needed.append(s)
                score += 8.0

        rating = float(u_dict.get("rating") or 4.5)
        score += (rating - 4.5) * 5.0

        blandas = [s["nombre"] for s in skills_rows if s["tipo"] == "Blanda"]
        if blandas:
            score += 2.0

        final_match = min(98, max(68, int(round(score))))
        u_dict["match"] = final_match
        u_dict["matched_skills"] = matched_needed if matched_needed else candidato_skills[:2]
        u_dict["cycle"] = f"{u_dict['ciclo']}º ciclo" if u_dict.get("ciclo") else "8º ciclo"
        u_dict["rating"] = round(rating, 2)
        u_dict["color"] = colores[idx % len(colores)]
        u_dict["availability"] = "Lun, mié y vie · Tardes" if idx % 2 == 0 else "Mar y jue · Noches"

        # Explicación contextual de complementariedad
        if cand_dom == "design":
            u_dict["ai_reason"] = f"Equilibra el perfil de {lider_carrera} sumando diseño centrado en el usuario, prototipado en Figma y usabilidad."
        elif cand_dom == "business":
            u_dict["ai_reason"] = f"Complementa la visión técnica estructurando costos, viabilidad económica y pitch para validación o inversión."
        elif cand_dom == "tech":
            u_dict["ai_reason"] = f"Aporta capacidad de construcción tecnológica y arquitectura para materializar los requerimientos del proyecto."
        elif cand_dom == "growth":
            u_dict["ai_reason"] = f"Potencia la comunicación estratégica, narrativa de producto y tracción de los primeros usuarios."
        elif cand_dom == "legal":
            u_dict["ai_reason"] = f"Asegura la protección legal, acuerdos entre socios y propiedad intelectual del proyecto."
        else:
            u_dict["ai_reason"] = f"Aporta perspectiva especializada en {u_dict['career']} para enriquecer la propuesta multidisciplinaria del equipo."

        resultados.append(u_dict)

    conn.close()

    # Ordenar por complementariedad real y habilidades
    resultados.sort(key=lambda x: (x["match"], len(x.get("matched_skills", [])), x.get("rating", 0)), reverse=True)

    return jsonify({
        "status": "success",
        "lider_carrera": lider_carrera,
        "total": len(resultados),
        "recomendaciones": resultados
    })
