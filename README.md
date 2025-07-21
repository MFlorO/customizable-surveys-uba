
# Descripción

## Correr en dev

1. Clonar el repositorio.
2. Crear el ```.env``` en base al archivo ```env.js```.

# Levantar el backend
3. Instalar las dependencias con ``` npm install ```.
4. Correr las migraciones de Prisma ``` npx prisma migrate dev ```
5. Correr el comando ``` npx prisma generate ``` que actualiza el cliente de Prisma (@prisma/client) y genera los enums como tipos TypeScript que podés importar.
6. Ejecutar seed ``` npm run seed ``` (cargar el seed a la base de datos).
7. Levantar el back, en la carpeta api. ```npm run server``` para levantarlo con nodemon.

# Levantar el frontend



## Esquema Base de Datos en Prisma - Resumen de tu Esquema:

# Modelos Principales:

1. Survey: .
2. Question: .
3. Option: .
4. LogicCondition: 

# Consideraciones:
1. Relaciones Opcionales: 