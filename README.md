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

