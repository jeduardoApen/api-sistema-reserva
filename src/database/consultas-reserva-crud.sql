
/*
* Reservas
**/

-- CREATE
INSERT INTO reservas
    (usuario_id, espacio_id, fecha_reserva, hora_inicio, hora_fin,
     motivo, nombre_cliente, estado_id, observaciones, created_at, updated_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW());

-- READ (listar con joins)
SELECT r.id, r.fecha_reserva, r.hora_inicio, r.hora_fin,
       r.motivo, r.nombre_cliente, r.observaciones,
       r.usuario_id, CONCAT(u.nombre, ' ', u.apellido) AS usuario_nombre,
       r.espacio_id, e.nombre AS espacio_nombre,
       r.estado_id, er.nombre AS estado_nombre,
       r.created_at, r.updated_at
FROM reservas r
JOIN usuarios u         ON u.id = r.usuario_id
JOIN espacios e         ON e.id = r.espacio_id
JOIN estados_reserva er ON er.id = r.estado_id
ORDER BY r.fecha_reserva DESC, r.hora_inicio DESC;

-- READ (por id)
SELECT r.id, r.fecha_reserva, r.hora_inicio, r.hora_fin,
       r.motivo, r.nombre_cliente, r.observaciones,
       r.usuario_id, CONCAT(u.nombre, ' ', u.apellido) AS usuario_nombre,
       r.espacio_id, e.nombre AS espacio_nombre,
       r.estado_id, er.nombre AS estado_nombre,
       r.created_at, r.updated_at
FROM reservas r
JOIN usuarios u         ON u.id = r.usuario_id
JOIN espacios e         ON e.id = r.espacio_id
JOIN estados_reserva er ON er.id = r.estado_id
WHERE r.id = ?;

-- UPDATE
UPDATE reservas
SET usuario_id = ?, espacio_id = ?, fecha_reserva = ?, hora_inicio = ?,
    hora_fin = ?, motivo = ?, nombre_cliente = ?, estado_id = ?,
    observaciones = ?, updated_at = NOW()
WHERE id = ?;

-- UPDATE (solo estado, típico para cancelar/confirmar)
UPDATE reservas SET estado_id = ?, updated_at = NOW() WHERE id = ?;

-- DELETE (físico)
DELETE FROM reservas WHERE id = ?;




/*
 * Tipos de espacios
 */

-- CREATE
INSERT INTO tipos_espacio (nombre, descripcion, activo, created_at, updated_at)
VALUES (?, ?, ?, NOW(), NOW());

-- READ (listar)
SELECT id, nombre, descripcion, activo, created_at, updated_at
FROM tipos_espacio
ORDER BY nombre;

-- READ (por id)
SELECT id, nombre, descripcion, activo, created_at, updated_at
FROM tipos_espacio
WHERE id = ?;

-- UPDATE
UPDATE tipos_espacio
SET nombre = ?, descripcion = ?, activo = ?, updated_at = NOW()
WHERE id = ?;

-- DELETE (físico)
DELETE FROM tipos_espacio WHERE id = ?;

-- DELETE (lógico / soft delete)
UPDATE tipos_espacio SET activo = 0, updated_at = NOW() WHERE id = ?;


/*
 * Espacios
 */

-- CREATE
INSERT INTO espacios (nombre, descripcion, ubicacion, capacidad, tipo_espacio_id, activo, created_at, updated_at)
VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW());

-- READ (listar con tipo)
SELECT e.id, e.nombre, e.descripcion, e.ubicacion, e.capacidad,
       e.tipo_espacio_id, t.nombre AS tipo_nombre, e.activo,
       e.created_at, e.updated_at
FROM espacios e
JOIN tipos_espacio t ON t.id = e.tipo_espacio_id
ORDER BY e.nombre;

-- READ (por id)
SELECT e.id, e.nombre, e.descripcion, e.ubicacion, e.capacidad,
       e.tipo_espacio_id, t.nombre AS tipo_nombre, e.activo,
       e.created_at, e.updated_at
FROM espacios e
JOIN tipos_espacio t ON t.id = e.tipo_espacio_id
WHERE e.id = ?;

-- UPDATE
UPDATE espacios
SET nombre = ?, descripcion = ?, ubicacion = ?, capacidad = ?,
    tipo_espacio_id = ?, activo = ?, updated_at = NOW()
WHERE id = ?;

-- DELETE (físico)
DELETE FROM espacios WHERE id = ?;

-- DELETE (lógico)
UPDATE espacios SET activo = 0, updated_at = NOW() WHERE id = ?;


/*
 * usuarios (admins)
 */

-- CREATE
INSERT INTO usuarios (nombre, apellido, correo, telefono, activo, created_at, updated_at)
VALUES (?, ?, ?, ?, ?, NOW(), NOW());

-- READ (listar)
SELECT id, nombre, apellido, correo, telefono, activo, created_at, updated_at
FROM usuarios
ORDER BY apellido, nombre;

-- READ (por id)
SELECT id, nombre, apellido, correo, telefono, activo, created_at, updated_at
FROM usuarios
WHERE id = ?;

-- READ (por correo, útil para login)
SELECT id, nombre, apellido, correo, telefono, activo
FROM usuarios
WHERE correo = ?;

-- UPDATE
UPDATE usuarios
SET nombre = ?, apellido = ?, correo = ?, telefono = ?, activo = ?, updated_at = NOW()
WHERE id = ?;

-- DELETE (físico)
DELETE FROM usuarios WHERE id = ?;

-- DELETE (lógico)
UPDATE usuarios SET activo = 0, updated_at = NOW() WHERE id = ?;


/*
 * Estados reserva
 */

-- CREATE
INSERT INTO estados_reserva (nombre) VALUES (?);

-- READ (listar)
SELECT id, nombre FROM estados_reserva ORDER BY nombre;

-- READ (por id)
SELECT id, nombre FROM estados_reserva WHERE id = ?;

-- UPDATE
UPDATE estados_reserva SET nombre = ? WHERE id = ?;

-- DELETE
DELETE FROM estados_reserva WHERE id = ?;


/*
 * Consultas esenciales
 */

/**
 * Reservas por espacio y fecha
 */
SELECT r.id, r.hora_inicio, r.hora_fin, r.nombre_cliente,
       er.nombre AS estado_nombre
FROM reservas r
JOIN estados_reserva er ON er.id = r.estado_id
WHERE r.espacio_id = ?
  AND r.fecha_reserva = ?
ORDER BY r.hora_inicio;


/*
 * Reservas por rango de fechas
 */

SELECT r.id, r.fecha_reserva, r.hora_inicio, r.hora_fin,
       e.nombre AS espacio_nombre, r.nombre_cliente, er.nombre AS estado_nombre
FROM reservas r
JOIN espacios e         ON e.id = r.espacio_id
JOIN estados_reserva er ON er.id = r.estado_id
WHERE r.fecha_reserva BETWEEN ? AND ?
ORDER BY r.fecha_reserva, r.hora_inicio;


/*
 * Reservas por estado
 */

SELECT r.id, r.fecha_reserva, r.hora_inicio, r.hora_fin,
       e.nombre AS espacio_nombre, r.nombre_cliente
FROM reservas r
JOIN espacios e ON e.id = r.espacio_id
WHERE r.estado_id = ?
ORDER BY r.fecha_reserva, r.hora_inicio;


/*
 * Verificar disponibilidad (¿está libre el espacio en ese horario?)
 */

SELECT r.id, r.hora_inicio, r.hora_fin, r.nombre_cliente, er.nombre AS estado_nombre
FROM reservas r
JOIN estados_reserva er ON er.id = r.estado_id
WHERE r.espacio_id = ?
  AND r.fecha_reserva = ?
  AND r.hora_inicio < ?   -- hora_fin solicitada
  AND r.hora_fin    > ?   -- hora_inicio solicitada
  AND er.nombre <> 'Cancelada';  -- ajusta según tus estados


/*
 * Espacios disponibles en una fecha/hora (los que NO tienen solapamiento)
 */

SELECT e.id, e.nombre, e.ubicacion, e.capacidad, t.nombre AS tipo_nombre
FROM espacios e
JOIN tipos_espacio t ON t.id = e.tipo_espacio_id
WHERE e.activo = 1
  AND e.id NOT IN (
      SELECT r.espacio_id
      FROM reservas r
      JOIN estados_reserva er ON er.id = r.estado_id
      WHERE r.fecha_reserva = ?
        AND r.hora_inicio < ?   -- hora_fin solicitada
        AND r.hora_fin    > ?   -- hora_inicio solicitada
        AND er.nombre <> 'Cancelada'
  )
ORDER BY e.nombre;