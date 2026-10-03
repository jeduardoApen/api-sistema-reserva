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

## Endpoint de verificación

```text
GET http://localhost:3000/api/health
```

Respuesta:

```json
{
  "success": true,
  "message": "API de reserva de espacios funcionando correctamente"
}
```

