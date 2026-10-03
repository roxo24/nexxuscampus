-- =====================================================================
-- BASE DE DATOS INSTITUCIONAL: UNIVERSIDAD NACIONAL DE PIURA (UNP)
-- Archivo: universidad_unp.sql
-- =====================================================================
PRAGMA foreign_keys = ON;

-- 1. Estructura de la Base de Datos Académica UNP
CREATE TABLE IF NOT EXISTS estudiantes_unp (
    codigo_estudiante VARCHAR(10) PRIMARY KEY, -- Formato oficial UNP (ej: 0202114005)
    dni VARCHAR(8) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo_institucional VARCHAR(150) NOT NULL UNIQUE,
    facultad VARCHAR(100) NOT NULL,
    carrera VARCHAR(100) NOT NULL,
    ciclo INTEGER NOT NULL,
    estado_matricula VARCHAR(30) DEFAULT 'Regular',
    fecha_ingreso VARCHAR(10) DEFAULT '2021-I'
);

-- 2. Datos de Prueba de Estudiantes de la UNP
INSERT INTO estudiantes_unp 
(codigo_estudiante, dni, nombres, apellidos, correo_institucional, facultad, carrera, ciclo, estado_matricula) 
VALUES
-- Estudiante 1: El que usarás para la DEMO (Perfil en Estado 0)
('0202114001', '73456789', 'Carlos', 'Mendoza Silva', 'cmendozas@unp.edu.pe', 'Facultad de Ingeniería Industrial', 'Ingeniería Industrial', 7, 'Regular'),

-- Estudiante 2: Programadora Fullstack (Informática)
('0202014022', '74123456', 'Lucía', 'Fernández Rojas', 'lfernandezr@unp.edu.pe', 'Facultad de Ciencias', 'Ingeniería Informática', 8, 'Regular'),

-- Estudiante 3: Administración y Negocios
('0202214033', '75987654', 'Mateo', 'Castillo Vílchez', 'mcastillov@unp.edu.pe', 'Facultad de Ciencias Administrativas', 'Administración de Empresas', 6, 'Regular'),

-- Estudiante 4: Legal y Regulatorio
('0201914044', '71654321', 'Valeria', 'Ríos Ramos', 'vriosr@unp.edu.pe', 'Facultad de Derecho y Ciencias Políticas', 'Derecho', 9, 'Regular'),

-- Estudiante 5: Agronomía (Especialista de campo)
('0202314055', '76321987', 'Jorge', 'García Seminario', 'jgarcias@unp.edu.pe', 'Facultad de Agronomía', 'Ingeniería Agrónoma', 5, 'Regular'),

-- Estudiante 6: Economía y Finanzas
('0202114066', '72456123', 'Ana', 'Rojas Chunga', 'arojasc@unp.edu.pe', 'Facultad de Economía', 'Economía', 7, 'Regular'),

-- Estudiante 7: Telecomunicaciones y Redes
('0202014077', '73981245', 'Diego', 'Quispe Navarro', 'dquispen@unp.edu.pe', 'Facultad de Ciencias', 'Ingeniería Electrónica y Telecomunicaciones', 8, 'Regular');