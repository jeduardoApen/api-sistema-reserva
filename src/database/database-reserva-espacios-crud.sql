-- ============================================================
-- Construcción de la base de datos: reserva_espacios
-- MySQL 8.4
-- ============================================================

DROP DATABASE IF EXISTS reserva_espacios;
CREATE DATABASE reserva_espacios
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE reserva_espacios;

-- ------------------------------------------------------------
-- 1. Catálogo: tipos_espacio
-- ------------------------------------------------------------
CREATE TABLE tipos_espacio (
    id          INT          NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NULL,
    activo      TINYINT(1)   NOT NULL DEFAULT 1,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT chk_tipos_espacio_activo CHECK (activo IN (0, 1))
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 2. Catálogo: estados_reserva
-- ------------------------------------------------------------
CREATE TABLE estados_reserva (
    id     INT         NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_estados_reserva_nombre (nombre)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 3. Usuarios (administradores)
-- ------------------------------------------------------------
CREATE TABLE usuarios (
    id         INT          NOT NULL AUTO_INCREMENT,
    nombre     VARCHAR(100) NOT NULL,
    apellido   VARCHAR(100) NOT NULL,
    correo     VARCHAR(150) NOT NULL,
    telefono   VARCHAR(30)  NULL,
    activo     TINYINT(1)   NOT NULL DEFAULT 1,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_usuarios_correo (correo),
    CONSTRAINT chk_usuarios_activo CHECK (activo IN (0, 1))
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 4. Espacios
-- ------------------------------------------------------------
CREATE TABLE espacios (
    id              INT          NOT NULL AUTO_INCREMENT,
    nombre          VARCHAR(100) NOT NULL,
    descripcion     VARCHAR(255) NULL,
    ubicacion       VARCHAR(150) NULL,
    capacidad       INT          NOT NULL,
    tipo_espacio_id INT          NOT NULL,
    activo          TINYINT(1)   NOT NULL DEFAULT 1,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_espacios_tipo (tipo_espacio_id),
    CONSTRAINT fk_espacio_tipo
        FOREIGN KEY (tipo_espacio_id) REFERENCES tipos_espacio (id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT chk_espacios_capacidad CHECK (capacidad > 0),
    CONSTRAINT chk_espacios_activo    CHECK (activo IN (0, 1))
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 5. Reservas
-- ------------------------------------------------------------
CREATE TABLE reservas (
    id             INT          NOT NULL AUTO_INCREMENT,
    usuario_id     INT          NOT NULL,
    espacio_id     INT          NOT NULL,
    fecha_reserva  DATE         NOT NULL,
    hora_inicio    TIME         NOT NULL,
    hora_fin       TIME         NOT NULL,
    motivo         VARCHAR(255) NULL,
    nombre_cliente VARCHAR(150) NOT NULL,
    estado_id      INT          NOT NULL,
    observaciones  VARCHAR(255) NULL,
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_reservas_espacio_fecha (espacio_id, fecha_reserva, hora_inicio, hora_fin),
    KEY idx_reservas_usuario_fecha (usuario_id, fecha_reserva),
    KEY idx_reservas_estado        (estado_id),
    CONSTRAINT fk_reserva_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_reserva_espacio
        FOREIGN KEY (espacio_id) REFERENCES espacios (id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_reserva_estado
        FOREIGN KEY (estado_id) REFERENCES estados_reserva (id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT chk_reservas_horario CHECK (hora_inicio < hora_fin)
) ENGINE=InnoDB;

-- ============================================================
-- Datos semilla
-- ============================================================

-- Estados de reserva
INSERT INTO estados_reserva (nombre) VALUES
    ('Pendiente'),
    ('Confirmada'),
    ('Cancelada'),
    ('Completada');

-- Tipos de espacio
INSERT INTO tipos_espacio (nombre, descripcion) VALUES
    ('Sala de reuniones', 'Espacio para reuniones de trabajo'),
    ('Aula',              'Espacio para clases o capacitaciones'),
    ('Cancha',            'Espacio deportivo'),
    ('Auditorio',         'Espacio para eventos y presentaciones');

-- Usuario administrador de ejemplo
INSERT INTO usuarios (nombre, apellido, correo, telefono) VALUES
    ('Admin', 'Sistema', 'admin@reservaespacios.local', '0000000000');

-- Espacios de ejemplo
INSERT INTO espacios (nombre, descripcion, ubicacion, capacidad, tipo_espacio_id) VALUES
    ('Sala A',   'Sala pequeña con proyector', 'Piso 1',   8,  1),
    ('Aula 101', 'Aula con pizarra',           'Piso 2',   30, 2),
    ('Cancha 1', 'Cancha múltiple',            'Exterior', 22, 3);