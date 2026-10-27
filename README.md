# Sistema de Reserva de Espacios

Backend / API REST de la aplicación de reserva de espacios.

## Integrantes

| Nombre | Carné |
| --- | --- |
| Herber Alberto Godoy García | 0900-22-16800 |
| Dyederichs Gabriel Munguia Gutierrez | 0900-18-2159 |
| Josué Eduardo Apén Bal | 0900-17-2948 |
| Diego Armando Alexander Castellanos De La Cruz | 0900-23-795 |

## Tecnologías

- Node.js
- Express
- MySQL

## Arquitectura

```text
Route
↓
Controller
↓
Service
↓
Repository
↓
MySQL
```

## Principio de diseño: KISS

El proyecto sigue el principio **KISS** (Keep It Simple, Stupid), que establece que las soluciones deben mantenerse **tan simples como sea posible**, evitando complejidades innecesarias.

> Si un problema puede resolverse de manera sencilla, no hay necesidad de implementar una solución más complicada.

### ¿Cómo se aplica en la programación?

KISS recomienda escribir código que sea:

- **Simple**: evitar estructuras y abstracciones innecesarias.
- **Legible**: cualquier desarrollador debería poder comprenderlo fácilmente.
- **Mantenible**: facilitar modificaciones y correcciones futuras.
- **Directo**: resolver el problema sin agregar funcionalidades que no se necesitan.
- **Fácil de probar**: reducir la cantidad de componentes y dependencias involucradas.

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Producción

```bash
npm start
```

---

# Documentación de la API

Guía para el desarrollador **frontend**. Aquí encontrarás todas las rutas, los datos que debes enviar y la respuesta que recibirás.

## URL base

```
http://localhost:3000/api
```

## Formato de respuesta

Todas las respuestas son en **JSON** y usan un formato común.

**Éxito** (datos):

```json
{
  "success": true,
  "data": { }
}
```

**Éxito** (solo mensaje, en borrados o desactivaciones):

```json
{
  "success": true,
  "message": "Mensaje de confirmación"
}
```

**Error:**

```json
{
  "success": false,
  "message": "Descripción del error"
}
```

## Códigos de estado HTTP

| Código | Significado | Cuándo ocurre |
| --- | --- | --- |
| `200` | OK | La petición se completó bien. |
| `201` | Creado | Se creó un registro correctamente. |
| `400` | Datos inválidos | Faltan datos o tienen un formato incorrecto. |
| `401` | No autorizado | Credenciales de login incorrectas. |
| `404` | No encontrado | El registro o el `id` no existe. |
| `409` | Conflicto | La reserva se cruza con otra existente. |
| `500` | Error interno | Error del servidor (ej. violación de llave foránea). |

---

## 1. Verificación

### `GET /api/health`

Comprueba que el servidor está funcionando. No necesita datos.

**Respuesta:**

```json
{
  "success": true,
  "message": "API de reserva de espacios funcionando correctamente"
}
```

### `GET /api/test-db`

Comprueba la conexión a la base de datos (solo para pruebas).

**Respuesta:**

```json
{
  "success": true,
  "message": "Conexión exitosa a Azure MySQL",
  "data": {
    "base_datos": "reserva_espacios",
    "version_mysql": "8.4.9-azure",
    "fecha_servidor": "2026-10-27T07:48:10.000Z"
  }
}
```

---

## 2. Autenticación

### `POST /api/auth/login`

Inicia sesión con correo y contraseña.

**Enviar (body):**

```json
{
  "correo": "admin@test.com",
  "password": "123456"
}
```

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `correo` | string | Sí | Correo del usuario. |
| `password` | string | Sí | Contraseña (texto plano, solo didáctico). |

**Respuesta exitosa (`200`):**

```json
{
  "success": true,
  "data": {
    "id": 7,
    "nombre": "Admin",
    "apellido": "Sistema",
    "correo": "admin@test.com",
    "telefono": "224426628",
    "activo": 1
  }
}
```

**Respuestas de error:**

- `400` → faltan `correo` o `password`.
- `401` → `"Credenciales inválidas"` (correo o contraseña incorrectos).

> ⚠️ La contraseña **no** se devuelve en la respuesta.

---

## 3. Tipos de espacio

**Base:** `/api/tipos-espacio`

**Forma del objeto:**

```json
{
  "id": 1,
  "nombre": "Sala de reuniones",
  "descripcion": "Espacio para reuniones de trabajo",
  "activo": 1,
  "created_at": "2026-10-27T07:54:10.000Z",
  "updated_at": "2026-10-27T07:54:10.000Z"
}
```

### `GET /api/tipos-espacio/obtener-tipos`

Lista todos los tipos de espacio.

**Respuesta:** `{ "success": true, "data": [ ...objetos... ] }`

### `GET /api/tipos-espacio/obtener-tipo/:id`

Obtiene un tipo por su `id`.

**Respuesta:** `{ "success": true, "data": { ...objeto... } }`

**Errores:** `400` (id inválido), `404` (no existe).

### `POST /api/tipos-espacio/crear-tipo`

Crea un tipo de espacio.

**Enviar (body):**

```json
{
  "nombre": "Sala de conferencias",
  "descripcion": "Sala grande con proyector"
}
```

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `nombre` | string | Sí | Nombre del tipo. |
| `descripcion` | string | No | Descripción. |

**Respuesta (`201`):** el objeto creado.

### `PUT /api/tipos-espacio/actualizar-tipo/:id`

Actualiza un tipo. Mismo body que el crear.

**Respuesta:** el objeto actualizado.

### `DELETE /api/tipos-espacio/eliminar-tipo/:id`

Borra **físicamente** un tipo.

**Respuesta:** `{ "success": true, "message": "Tipo de espacio eliminado correctamente" }`

### `POST /api/tipos-espacio/desactivar-tipo/:id`

Borra **lógicamente** (deja `activo = 0`).

**Respuesta:** `{ "success": true, "message": "Tipo de espacio desactivado correctamente" }`

---

## 4. Espacios

**Base:** `/api/espacios`

**Forma del objeto:**

```json
{
  "id": 2,
  "nombre": "Sala A",
  "descripcion": "Sala pequeña con proyector",
  "ubicacion": "Piso 1",
  "capacidad": 8,
  "tipo_espacio_id": 1,
  "tipo_nombre": "Sala de reuniones",
  "activo": 1,
  "created_at": "2026-10-27T07:54:10.000Z",
  "updated_at": "2026-10-27T07:54:10.000Z"
}
```

### `GET /api/espacios/obtener-espacios`

Lista todos los espacios.

**Respuesta:** `{ "success": true, "data": [ ...objetos... ] }`

### `GET /api/espacios/obtener-espacio/:id`

Obtiene un espacio por su `id`.

**Errores:** `400` (id inválido), `404` (no existe).

### `GET /api/espacios/obtener-disponibles`

Lista los espacios **libres** en una fecha y rango horario.

**Enviar (query params):**

```
/api/espacios/obtener-disponibles?fecha=2026-10-28&hora_inicio=10:00&hora_fin=12:00
```

| Param | Obligatorio | Descripción |
| --- | --- | --- |
| `fecha` | Sí | Fecha `YYYY-MM-DD`. |
| `hora_inicio` | Sí | Hora de inicio `HH:MM`. |
| `hora_fin` | Sí | Hora de fin `HH:MM`. |

**Respuesta:** lista de espacios disponibles.

### `POST /api/espacios/crear-espacio`

Crea un espacio.

**Enviar (body):**

```json
{
  "nombre": "Sala B",
  "descripcion": "Sala con pizarra",
  "ubicacion": "Piso 2",
  "capacidad": 12,
  "tipo_espacio_id": 1
}
```

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `nombre` | string | Sí | Nombre del espacio. |
| `ubicacion` | string | Sí | Ubicación. |
| `capacidad` | number | Sí | Entero mayor a 0. |
| `tipo_espacio_id` | number | Sí | Id de un tipo de espacio existente. |
| `descripcion` | string | No | Descripción. |

**Respuesta (`201`):** el objeto creado.

### `PUT /api/espacios/actualizar-espacio/:id`

Actualiza un espacio. Mismo body que el crear.

**Respuesta:** el objeto actualizado.

### `DELETE /api/espacios/eliminar-espacio/:id`

Borra **físicamente** un espacio.

**Respuesta:** `{ "success": true, "message": "Espacio eliminado correctamente" }`

### `POST /api/espacios/desactivar-espacio/:id`

Borra **lógicamente** (deja `activo = 0`).

**Respuesta:** `{ "success": true, "message": "Espacio desactivado correctamente" }`

---

## 5. Estados de reserva

**Base:** `/api/estados-reserva`

**Forma del objeto:**

```json
{ "id": 1, "nombre": "Pendiente" }
```

### `GET /api/estados-reserva/obtener-estados`

Lista todos los estados.

### `GET /api/estados-reserva/obtener-estado/:id`

Obtiene un estado por su `id`.

### `POST /api/estados-reserva/crear-estado`

Crea un estado.

**Enviar (body):**

```json
{ "nombre": "En espera" }
```

**Respuesta (`201`):** el objeto creado.

### `PUT /api/estados-reserva/actualizar-estado/:id`

Actualiza un estado. Mismo body que el crear.

### `DELETE /api/estados-reserva/eliminar-estado/:id`

Borra un estado.

**Respuesta:** `{ "success": true, "message": "Estado de reserva eliminado correctamente" }`

---

## 6. Reservas

**Base:** `/api/reservas`

**Forma del objeto (listar / por id):**

```json
{
  "id": 1,
  "fecha_reserva": "2026-10-28",
  "hora_inicio": "10:00:00",
  "hora_fin": "12:00:00",
  "motivo": "Reunión",
  "nombre_cliente": "Juan Pérez",
  "observaciones": null,
  "usuario_id": 7,
  "usuario_nombre": "Admin Sistema",
  "espacio_id": 2,
  "espacio_nombre": "Sala A",
  "estado_id": 1,
  "estado_nombre": "Pendiente",
  "created_at": "2026-10-27T12:00:00.000Z",
  "updated_at": "2026-10-27T12:00:00.000Z"
}
```

### `GET /api/reservas/obtener-reservas`

Lista todas las reservas.

### `GET /api/reservas/obtener-reserva/:id`

Obtiene una reserva por su `id`.

### `POST /api/reservas/crear-reserva`

Crea una reserva. **Valida que no haya cruce de horarios.**

**Enviar (body):**

```json
{
  "usuario_id": 7,
  "espacio_id": 2,
  "fecha_reserva": "2026-10-28",
  "hora_inicio": "10:00",
  "hora_fin": "12:00",
  "motivo": "Reunión",
  "nombre_cliente": "Juan Pérez",
  "estado_id": 1,
  "observaciones": "opcional"
}
```

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `usuario_id` | number | Sí | Id del usuario que crea la reserva. |
| `espacio_id` | number | Sí | Id del espacio. |
| `fecha_reserva` | string | Sí | Fecha `YYYY-MM-DD`. |
| `hora_inicio` | string | Sí | Hora `HH:MM`. |
| `hora_fin` | string | Sí | Hora `HH:MM`, mayor que `hora_inicio`. |
| `motivo` | string | Sí | Motivo de la reserva. |
| `nombre_cliente` | string | Sí | Nombre de quien solicita. |
| `estado_id` | number | Sí | Id del estado (ej. `1` Pendiente). |
| `observaciones` | string | No | Observaciones. |

**Respuesta (`201`):** el objeto creado.

**Errores:** `400` (datos inválidos), `404` (espacio o estado no existe), `409` (`"El espacio ya está reservado en ese horario"`).

### `PUT /api/reservas/actualizar-reserva/:id`

Actualiza una reserva. Mismo body que el crear. También valida cruces de horarios.

### `PATCH /api/reservas/cambiar-estado/:id`

Cambia solo el estado de una reserva (para confirmar o cancelar).

**Enviar (body):**

```json
{ "estado_id": 3 }
```

**Respuesta:** el objeto actualizado.

### `DELETE /api/reservas/eliminar-reserva/:id`

Borra físicamente una reserva.

**Respuesta:** `{ "success": true, "message": "Reserva eliminada correctamente" }`

### `GET /api/reservas/obtener-por-espacio`

Reservas de un espacio en una fecha.

```
/api/reservas/obtener-por-espacio?espacio_id=2&fecha=2026-10-28
```

**Respuesta:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "hora_inicio": "10:00:00",
      "hora_fin": "12:00:00",
      "nombre_cliente": "Juan Pérez",
      "estado_nombre": "Pendiente"
    }
  ]
}
```

### `GET /api/reservas/obtener-por-rango`

Reservas entre dos fechas.

```
/api/reservas/obtener-por-rango?desde=2026-10-27&hasta=2026-10-29
```

### `GET /api/reservas/obtener-por-estado/:estadoId`

Reservas de un estado.

```
/api/reservas/obtener-por-estado/3
```

### `GET /api/reservas/verificar-disponibilidad`

Comprueba si un espacio está libre en una fecha y horario.

```
/api/reservas/verificar-disponibilidad?espacio_id=2&fecha=2026-10-28&hora_inicio=10:00&hora_fin=12:00
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "disponible": false,
    "conflictos": [
      {
        "id": 1,
        "hora_inicio": "10:00:00",
        "hora_fin": "12:00:00",
        "nombre_cliente": "Juan Pérez",
        "estado_nombre": "Pendiente"
      }
    ]
  }
}
```

> `disponible` es `true` si no hay conflictos, y `false` si el espacio ya está ocupado. `conflictos` es la lista de reservas que se cruzan.

---

## 7. Usuarios

**Base:** `/api/usuarios`

**Forma del objeto (sin contraseña):**

```json
{
  "id": 7,
  "nombre": "Admin",
  "apellido": "Sistema",
  "correo": "admin@test.com",
  "telefono": "224426628",
  "activo": 1,
  "created_at": "2026-10-27T12:34:09.000Z",
  "updated_at": "2026-10-27T12:35:26.000Z"
}
```

### `GET /api/usuarios/obtener-usuarios`

Lista todos los usuarios.

### `GET /api/usuarios/obtener-usuarios?activo=1`

Lista solo los usuarios **activos**.

> ⚠️ La contraseña **nunca** se devuelve en estos endpoints.

---

## Notas importantes para el frontend

1. **Borrado lógico vs físico:** los módulos con campo `activo` (tipos de espacio y espacios) tienen dos formas de "borrar":
   - `DELETE` → borrado **físico** (desaparece de la base de datos).
   - `POST .../desactivar` → borrado **lógico** (se oculta con `activo = 0`).

2. **Cruce de horarios:** el backend rechaza con `409` cualquier reserva que se cruce con otra existente (del mismo espacio y fecha). Usa `verificar-disponibilidad` para comprobar antes de crear.

3. **Formatos:** fechas en `YYYY-MM-DD` y horas en `HH:MM` (24 horas).

4. **Autenticación:** el login es **didáctico** (contraseña en texto plano). No hay sesión ni token; los demás endpoints no requieren autenticación por ahora.

5. **Ids:** los `:id` de las rutas deben ser números enteros positivos.
