-- ========================================================
-- NEXUSCAMPUS - ESQUEMA DDL Y DATOS SEMILLA (SQLITE)
-- ========================================================

PRAGMA foreign_keys = ON;


-- --------------------------------------------------------
-- 2. TABLA CARRERAS
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS carreras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    universidad_id INTEGER REFERENCES universidades(id) ON DELETE SET NULL,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- --------------------------------------------------------
-- 3. TABLA USUARIOS
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo_estudiante VARCHAR(50) NOT NULL UNIQUE,
    correo_institucional VARCHAR(150) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    carrera_id INTEGER NOT NULL REFERENCES carreras(id),
    universidad_id INTEGER REFERENCES universidades(id) ON DELETE SET NULL,
    ciclo INTEGER,
    numero_celular VARCHAR(20),
    perfil_completado BOOLEAN NOT NULL DEFAULT 0,
    terminos_y_condiciones BOOLEAN NOT NULL DEFAULT 0,
    situacion_actual VARCHAR(50), -- 'Tengo un proyecto' OR 'Busco equipo'
    reputacion_promedio DECIMAL(3,2) DEFAULT 0.00,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- 4. TABLA HABILIDADES
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS habilidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    tipo VARCHAR(20) NOT NULL, -- 'Dura' o 'Blanda'
    carrera_id INTEGER REFERENCES carreras(id) ON DELETE SET NULL
);

-- --------------------------------------------------------
-- 5. TABLA PIVOTE USUARIO_HABILIDADES
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario_habilidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    habilidad_id INTEGER NOT NULL REFERENCES habilidades(id) ON DELETE CASCADE,
    UNIQUE(usuario_id, habilidad_id)
);

-- --------------------------------------------------------
-- 6. TABLA PROYECTOS
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS proyectos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lider_id INTEGER NOT NULL REFERENCES usuarios(id),
    nombre VARCHAR(150) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    nivel_madurez VARCHAR(50) NOT NULL,
    publicado BOOLEAN DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'Activo', -- 'Activo' / 'Completado' / 'Cancelado'
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- 7. TABLA VACANTES_PROYECTO
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS vacantes_proyecto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proyecto_id INTEGER NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    habilidad_id INTEGER REFERENCES habilidades(id) ON DELETE SET NULL,
    carrera_requerida_id INTEGER REFERENCES carreras(id) ON DELETE SET NULL,
    cubierta BOOLEAN DEFAULT 0
);

-- --------------------------------------------------------
-- 8. TABLA MIEMBROS_PROYECTO
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS miembros_proyecto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proyecto_id INTEGER NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    rol_en_proyecto VARCHAR(100),
    fecha_incorporacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'Activo'
);

-- --------------------------------------------------------
-- 9. TABLA SOLICITUDES_MATCH
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS solicitudes_match (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    remitente_id INTEGER NOT NULL REFERENCES usuarios(id),
    destinatario_id INTEGER NOT NULL REFERENCES usuarios(id),
    proyecto_id INTEGER NOT NULL REFERENCES proyectos(id),
    mensaje TEXT,
    estado VARCHAR(20) DEFAULT 'Pendiente', -- 'Pendiente', 'Aceptada', 'Rechazada', 'Descartada'
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta DATETIME
);

-- --------------------------------------------------------
-- 10. TABLA NOTIFICACIONES
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS notificaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    solicitud_id INTEGER REFERENCES solicitudes_match(id) ON DELETE CASCADE,
    titulo VARCHAR(150) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT 0,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- 11. TABLA SALAS_CHAT
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS salas_chat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proyecto_id INTEGER NOT NULL UNIQUE REFERENCES proyectos(id) ON DELETE CASCADE,
    enlace_whatsapp VARCHAR(255),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- 12. TABLA MENSAJES_CHAT
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS mensajes_chat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sala_chat_id INTEGER NOT NULL REFERENCES salas_chat(id) ON DELETE CASCADE,
    remitente_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    contenido TEXT NOT NULL,
    es_mensaje_sistema BOOLEAN DEFAULT 0,
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- 13. TABLA MOTIVOS_SALIDA
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS motivos_salida (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(150) NOT NULL UNIQUE
);

-- --------------------------------------------------------
-- 14. TABLA SALIDAS_PROYECTO
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS salidas_proyecto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proyecto_id INTEGER NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    motivo_salida_id INTEGER NOT NULL REFERENCES motivos_salida(id),
    comentario_adicional TEXT,
    fecha_salida DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- POBLACIÓN DE DATOS SEMILLA (FICTICIOS Y REALISTAS)
-- ========================================================

-- Catálogo de Carreras
INSERT INTO carreras (id, nombre, descripcion) VALUES
(1, 'Ingeniería Informática', 'Software, arquitectura en la nube e inteligencia artificial'),
(2, 'Administración de Empresas', 'Gestión estratégica, finanzas y formulación de modelos de negocio'),
(3, 'Ingeniería Agroindustrial', 'Procesamiento de recursos biológicos, control de calidad y agroexportación'),
(4, 'Economía', 'Análisis de viabilidad económica, costos y proyecciones de mercado'),
(5, 'Diseño Digital y Comunicación', 'Diseño de interfaces UI/UX, branding e identidad visual');

-- Catálogo de Habilidades Duras y Blandas
INSERT INTO habilidades (id, nombre, tipo, carrera_id) VALUES
(1, 'Desarrollo Frontend React', 'Dura', 1),
(2, 'Backend Python y APIs', 'Dura', 1),
(3, 'Modelado Financiero y Pitch', 'Dura', 2),
(4, 'Optimización de Procesos Agro', 'Dura', 3),
(5, 'Análisis de Viabilidad Económica', 'Dura', 4),
(6, 'Diseño UI/UX en Figma', 'Dura', 5),
(7, 'Liderazgo y Gestión de Equipos', 'Blanda', NULL),
(8, 'Comunicación Asertiva', 'Blanda', NULL),
(9, 'Resolución Rápida de Conflictos', 'Blanda', NULL),
(10, 'Adaptabilidad al Cambio', 'Blanda', NULL);

-- Catálogo de Motivos de Salida (CU-05)
INSERT INTO motivos_salida (id, nombre) VALUES
(1, 'Incompatibilidad de horarios / Carga académica'),
(2, 'Pérdida de interés en la temática del proyecto'),
(3, 'Falta de comunicación interna del equipo'),
(4, 'Desacuerdo con las decisiones del líder/equipo'),
(5, 'Incumplimiento de tareas pactadas'),
(6, 'Proyecto finalizado exitosamente');

-- Estudiantes de Prueba
INSERT INTO usuarios (id, codigo_estudiante, correo_institucional, nombres, apellidos, carrera_id, universidad_id, ciclo, numero_celular, perfil_completado, terminos_y_condiciones, situacion_actual, reputacion_promedio) VALUES
-- Perfil 1: Con proyecto activo (Líder técnico)
(1, '20220101', 'jperez@alumnos.edu.pe', 'Juan Carlos', 'Pérez Gómez', 1, NULL, 8, '+51973000111', 1, 1, 'Tengo un proyecto', 4.80),
-- Perfil 2: Buscando equipo (Área de Negocios)
(2, '20220202', 'mflores@alumnos.edu.pe', 'María Elena', 'Flores Silva', 2, NULL, 7, '+51973000222', 1, 1, 'Busco equipo', 4.50),
-- Perfil 3: Buscando equipo (Especialista Agro)
(3, '20210303', 'csuarez@alumnos.edu.pe', 'Carlos Alberto', 'Suárez Ramos', 3, NULL, 9, '+51973000333', 1, 1, 'Busco equipo', 4.90),
-- Perfil 4: Diseñadora incorporada a equipo
(4, '20230404', 'lcastillo@alumnos.edu.pe', 'Lucía', 'Castillo Mendoza', 5, NULL, 5, '+51973000444', 1, 1, 'Busco equipo', 4.70),
-- Perfil 5: Estado inicial (Pendiente de completar onboarding CU-00)
(5, '20240505', 'rvalverde@alumnos.edu.pe', 'Rodrigo', 'Valverde Peña', 4, NULL, 3, '+51973000555', 0, 0, NULL, 0.00);

-- Asignación de Habilidades a Usuarios (N:M)
INSERT INTO usuario_habilidades (usuario_id, habilidad_id) VALUES
(1, 2), -- Juan: Backend
(1, 7), -- Juan: Liderazgo
(1, 10),-- Juan: Adaptabilidad
(2, 3), -- María: Finanzas
(2, 8), -- María: Comunicación
(3, 4), -- Carlos: Procesos Agro
(3, 10),-- Carlos: Adaptabilidad
(4, 6), -- Lucía: Figma UI/UX
(4, 8); -- Lucía: Comunicación

-- Proyectos
INSERT INTO proyectos (id, lider_id, nombre, sector, descripcion, nivel_madurez, publicado, estado) VALUES
(1, 1, 'AgroSmart Piura', 'Agroindustria', 'Sistema de telemetría y predicción de cosechas mediante sensores IoT e inteligencia artificial.', 'Prototipo en desarrollo', 1, 'Activo'),
(2, 1, 'EcoFinanz', 'Fintech', 'Plataforma de microcréditos colaborativos para proyectos estudiantiles.', 'Idea inicial', 0, 'Activo');

-- Vacantes del Proyecto 1
INSERT INTO vacantes_proyecto (id, proyecto_id, usuario_id, habilidad_id, carrera_requerida_id, cubierta) VALUES
(1, 1, NULL, 3, 2, 0), -- Vacante libre: Finanzas
(2, 1, 4, 6, 5, 1);    -- Cubierta por Lucía: Diseño UI/UX

-- Miembros formales del Proyecto 1
INSERT INTO miembros_proyecto (id, proyecto_id, usuario_id, rol_en_proyecto, estado) VALUES
(1, 1, 1, 'Líder de Proyecto & Backend Lead', 'Activo'),
(2, 1, 4, 'Diseñadora de Experiencia UI/UX', 'Activo');

-- Solicitudes de Match (CU-01 / CU-02)
INSERT INTO solicitudes_match (id, remitente_id, destinatario_id, proyecto_id, mensaje, estado, fecha_respuesta) VALUES
(1, 1, 2, 1, 'Hola María, revisamos tu perfil en finanzas y queremos que valides nuestro modelo de monetización.', 'Pendiente', NULL),
(2, 1, 4, 1, 'Hola Lucía, te invitamos a diseñar los flujos de usuario y pantallas del prototipo.', 'Aceptada', CURRENT_TIMESTAMP);

-- Notificación de invitación pendiente
INSERT INTO notificaciones (id, usuario_id, solicitud_id, titulo, mensaje, leida) VALUES
(1, 2, 1, 'Nueva invitación a proyecto', 'El proyecto AgroSmart Piura te ha enviado una solicitud para el rol de Modelado Financiero.', 0);

-- Sala de Chat del Proyecto 1 (CU-02 / CU-06)
INSERT INTO salas_chat (id, proyecto_id, enlace_whatsapp) VALUES
(1, 1, 'https://chat.whatsapp.com/L1nkF1ct1c10Pr0y3ct0Agro');

-- Mensajes de Chat (Icebreaker automático y enlace)
INSERT INTO mensajes_chat (id, sala_chat_id, remitente_id, contenido, es_mensaje_sistema) VALUES
(1, 1, NULL, '¡Equipo conectado con éxito! 🎉 Se ha unido Lucía al proyecto AgroSmart Piura. ¡Comiencen a coordinar su primer hito aquí!', 1),
(2, 1, 1, 'Hola Lucía, bienvenida al equipo. Te paso el enlace con los accesos.', 0),
(3, 1, NULL, '🔗 ¡Grupo de WhatsApp creado con éxito! Únanse aquí: https://chat.whatsapp.com/L1nkF1ct1c10Pr0y3ct0Agro', 1);

-- Historial de Salida (CU-05)
INSERT INTO salidas_proyecto (id, proyecto_id, usuario_id, motivo_salida_id, comentario_adicional) VALUES
(1, 1, 3, 1, 'El estudiante se retiró por cruce de horarios con sus prácticas pre-profesionales.');