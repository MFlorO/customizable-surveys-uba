
# Descripción
Este es el backend de una aplicación de encuestas con lógica condicional, desarrollado con **Node.js**, **Express**, **TypeScript** y **Prisma** como ORM para PostgreSQL. Incluye documentación de API mediante **Swagger**.

## Correr en desarrollo

1. Clonar el repositorio.
2. Crear el ```.env``` en base al archivo ```env.ts```.

# Levantar el backend
3. Instalar las dependencias con ``` npm install ```.
4. Correr las migraciones de Prisma ``` npx prisma migrate dev ```
5. Correr el comando ``` npx prisma generate ``` que actualiza el cliente de Prisma (@prisma/client) y genera los enums como tipos TypeScript que podés importar.
6. Ejecutar seed ``` npm run seed ``` (cargar el seed de prueba a la base de datos).
7. Levantar el back, en la carpeta api. ```npm run server``` para levantarlo con nodemon.
8. Accedé a ```http://localhost:3001/api-docs``` para ver la documentación de la API generada con Swagger.

# Levantar el frontend



## Esquema Base de Datos en Prisma - Resumen de tu Esquema:

# Modelos Principales:

| Modelo           | Descripción                                 |
| ---------------- | ------------------------------------------- |
| `Survey`         | Representa una encuesta                     |
| `Question`       | Pregunta individual dentro de una sección   |
| `Option`         | Opciones asociadas a preguntas              |
| `LogicCondition` | Define condiciones lógicas entre preguntas  |
| `Response`       | Respuesta enviada por un usuario            |
| `Answer`         | Respuesta individual dentro de una encuesta |


- Consideraciones: 
1. Relaciones opcionales para permitir flexibilidad (por ejemplo: preguntas condicionales - Logic Condition).
2. Enums para estados (DRAFT, PUBLISHED, etc).


## Enpoints:

# Survey

| Método | Ruta                   | Acción                                     |
| ------ | -----------------------| -------------------------------------------|
| POST   | `/surveys`             | Crear encuesta                             |
| PUT    | `/surveys/:id`         | Editar título/descripción (si DRAFT)       |
| POST   | `/surveys/:id/publish` | Publicar encuesta (cambiar a PUBLISHED)    |
| GET    | `/surveys`             | Listar todas las encuestas                 |
| GET    | `/surveys/:id`         | Ver una encuesta con secciones y preguntas |
| DELETE | `/surveys/:id`         | Borrar encuesta por id                     |

# Response

| Método | Ruta                   | Acción                                                              |
|--------|------------------------|---------------------------------------------------------------------|
| POST   | `/response`            | Enviar una respuesta a una encuesta publicada                       |
| GET    | `/response/:id`        | Obtener una respuesta completa agrupada por secciones y preguntas   |
| GET    | `/response/surveys/:id`| Obtener todas las respuestas enviadas para una encuesta específica  |


## Tecnologías utilizadas:

- Node.js
- Express
- TypeScript
- Prisma + PostgreSQL
- Swagger para documentación
- Nodemon para desarrollo
- Zod (para validaciones)
- Morgan (logger)
- CORS
- cookie-parser
- Body-parser
- ts-node