# Consigna Proyecto Final Curso Backend

## Quick Start

Instalar dependencias
```bash
yarn install
```

Migrar la Base de datos
```bash
yarn migrateDB
```

Levantar en modo desarrollo
```bash
yarn dev
```

Levantar en modo produccion
```bash
yarn start
```

## Table of Contents

- [Consigna Proyecto Final Curso Backend](#consigna-proyecto-final-curso-backend)
  - [Quick Start](#quick-start)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Commands](#commands)
  - [Variables de entorno](#variables-de-entorno)
  - [Estructura del proyecto](#estructura-del-proyecto)
  - [Migracion de BD](#migracion-de-bd)
  - [API Documentation](#api-documentation)
    - [API Endpoints](#api-endpoints)
  - [Error Handling](#error-handling)
  - [Validacion](#validacion)
  - [Autenticacion](#autenticacion)
  - [Logging](#logging)
  - [Plugins Custom para Mongoose](#plugins-custom-para-mongoose)
    - [toJSON](#tojson)
    - [paginate](#paginate)
    - [autoIncrement](#autoincrement)
  - [Limiter](#limiter)
  - [Aclaraciones](#aclaraciones)
      - [Duracion del tiempo de sesión](#duracion-del-tiempo-de-sesión)
      - [Configuracion de diversos entornos](#configuracion-de-diversos-entornos)
      - [Fecha y hora de las ordenes](#fecha-y-hora-de-las-ordenes)

## Features

- **Base de datos NoSQL**: [MongoDB](https://www.mongodb.com) Object data modeling utilizando [Mongoose](https://mongoosejs.com)
- **Autenticacion and autorizacion**: utilizando JWT [passport](http://www.passportjs.org)
- **Validacion**: request data validation con [Joi](https://github.com/hapijs/joi)
- **Logging**: utilizando [winston](https://github.com/winstonjs/winston) and [morgan](https://github.com/expressjs/morgan)
- **Error handling**: mecanismo de error handling centralizado.
- **Documentación de la API**: con [Postman](https://www.postman.com/).
- **Administración de procesos**: con [PM2](https://pm2.keymetrics.io)
- **Manejo de dependencias**: Utilizando [Yarn](https://yarnpkg.com)
- **Variables de entorno**: Utilizando [dotenv](https://github.com/motdotla/dotenv) y [cross-env](https://github.com/kentcdodds/cross-env#readme) para diversos entornos (Windows/Mac/Linux)
- **Seguridad**: Seteo de headers HTTP con [helmet](https://helmetjs.github.io)
- **Sanitizacion**: Sanitización de las request ante xss y query injection
- **CORS**: Cross-Origin Resource-Sharing habilitado utilizando [cors](https://github.com/expressjs/cors)
- **Compresion**: gzip compression con [compression](https://github.com/expressjs/compression)

## Commands

Running locally:

```bash
yarn dev
```

Running in production:

```bash
yarn start
```

## Variables de entorno

Las variables de entorno se encuentran en el archivo `.env`. Vienen con estos valores por defecto:

```bash
# Port number
PORT=3000

# URL of the Mongo DB
MONGODB_URL=mongodb://localhost:27017/ecommerce

# JWT
# JWT secret key
JWT_SECRET=kunai
# Number of minutes after which an access token expires
JWT_ACCESS_EXPIRATION_MINUTES=30
# Number of days after which a refresh token expires
JWT_REFRESH_EXPIRATION_DAYS=30

# SMTP configuration options for the email service
# For testing, you can use a fake SMTP service like Ethereal: https://ethereal.email/create
SMTP_HOST=email-server
SMTP_PORT=587
SMTP_USERNAME=email-server-username
SMTP_PASSWORD=email-server-password
EMAIL_FROM=support@yourapp.com
```

## Estructura del proyecto

Se implemento una estructura basada en capas (MVC)
```
src\
  | --config \ # Variables de entorno y cosas relacionadas con la configuración
  | --controllers \ # Controladores de ruta (capa de controlador)
  | --docs \ # Archivos Swagger
  | --middlewares \ # middlewares expresos personalizados
  | --models \ # Modelos de Mongoose (capa de datos)
  | --rutas \ # Rutas
  | --services \ # Lógica empresarial (capa de servicio)
  | --utils \ # Funciones y clases de utilidad
  | --validations \ # Solicitar esquemas de validación de datos
  | --app.js # Aplicación Express
  |--index.js        # Punto de entrada de la aplicación
```

## Migracion de BD
Para migrar la base de datos, se utiliza el paquete `migrate-mongo`(https://www.npmjs.com/package/migrate-mongo). Utilizar el comando definido en package.json

## API Documentation

Para ver el listado de endpoints y sus especificaciones, importar el archivo Entrega_Final.postman_collection.json en el cliente de Postman.

Recordar configurar el header de autenticacion con esquema bearer en la colección de postman.
1. Registrarse
2. Logearse
3. Copiar el access token obtenido en el paso anterior
4. Ingresar el access token como Autenticación en la configuración de la colección de Postman

### API Endpoints

Listado de rutas disponibles:

**Auth routes**:\
`POST /api/auth/register` - register\
`POST /api/auth/login` - login\
`POST /api/auth/refresh-tokens` - refrescar auth tokens\
`POST /api/auth/verify-tokens` - verificar auth tokens\

**Product routes**:\
`POST /api/products` - crear un producto\
`GET /api/products` - obtener todos los producto\
`GET /api/products/:product` - obtener un producto\
`PATCH /api/products/:productId` - actualizar un producto\
`DELETE /api/products/:productId` - eliminar un producto

**Cart routes**:\
`POST /api/cart/addProduct` - Añadir producto al carrito
`POST /api/cart/removeProduct` - Remover producto del carrito

**Order routes**:\
`GET /api/order/` - Obtener todas las ordenes
`POST /api/order/confirmar` - Confirmar la orden actual en carrito para el usuario logeado

## Error Handling

La aplicación tiene un mecanismo de manejo de errores centralizado.

Los controladores intentan detectar los errores y reenviarlos al middleware de manejo de errores (llamando a `next (error)`). Para mayor comodidad, también se envuelve el controlador dentro del contenedor de la utilidad catchAsync, que reenvía el error.

```javascript
const catchAsync = require('../utils/catchAsync');

const controller = catchAsync(async (req, res) => {
  // Este error se reenviará al middleware de manejo de errores
  throw new Error('Something wrong happened');
});
```
El middleware de manejo de errores envía una respuesta de error, que tiene el siguiente formato:

```json
{
  "code": 404,
  "message": "Not found"
}
```
Cuando se ejecuta en modo de desarrollo, la respuesta de error también contiene la pila de errores.

La aplicación tiene una clase de utilidad ApiError a la que puede adjuntar un código de respuesta y un mensaje, y luego lanzarlo desde cualquier lugar (catchAsync lo detectará).

Por ejemplo, si está tratando de obtener un usuario de la base de datos que no se encuentra y desea enviar un error 404, el código debería verse así:

```javascript
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

const getUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
};
```

Al suceder un error, se devuelve una vista generada en EJS con el numero de error y el mensaje

## Validacion

Los datos de la solicitud se validan mediante [Joi] (https://joi.dev/). Consulte la [documentación] (https://joi.dev/api/) para obtener más detalles sobre cómo escribir esquemas de validación Joi.

Los esquemas de validación se definen en el directorio `src / validations` y se utilizan en las rutas proporcionándolos como parámetros al middleware` validate`.

```javascript
const express = require('express');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.post('/users', validate(userValidation.createUser), userController.createUser);
```

## Autenticacion

Para requerir autenticación para ciertas rutas, puede usar el middleware `auth`.

```javascript
const express = require('express');
const authMiddlewares = require('../../middlewares/auth');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.post('/users', authMiddlewares.auth(), userController.createUser);
```

Estas rutas requieren un token de acceso JWT válido en el encabezado de la solicitud de autorización utilizando el esquema de portador. Si la solicitud no contiene un token de acceso válido, se genera un error No autorizado (401).

**Generando Access Tokens**:

Se puede generar un token de acceso haciendo una llamada exitosa a los puntos finales de registro (`POST / auth / register`) o de inicio de sesión (` POST / auth / login`). La respuesta de estos puntos finales también contiene tokens de actualización (que se explican a continuación).

Un token de acceso es válido por 30 minutos. Puede modificar este tiempo de vencimiento cambiando la variable de entorno `JWT_ACCESS_EXPIRATION_MINUTES` en el archivo .env.

**Refrescando Access Tokens**:

Una vez que expira el token de acceso, se puede generar un nuevo token de acceso haciendo una llamada al punto final del token de actualización (`POST / auth / refresh-tokens`) y enviando un token de actualización válido en el cuerpo de la solicitud. Esta llamada devuelve un nuevo token de acceso y un nuevo token de actualización.

Un token de actualización es válido por 30 días. Se puede modificar este tiempo de vencimiento cambiando la variable de entorno `JWT_REFRESH_EXPIRATION_DAYS` en el archivo .env.

## Logging

Ubicado en `src / config / logger.js`. Se utiliza la biblioteca de registro [Winston] (https://github.com/winstonjs/winston).

El registro se realiza de acuerdo con los siguientes niveles de gravedad (orden ascendente del más importante al menos importante):

```javascript
const logger = require('<path to src>/config/logger');

logger.error('message'); // nivel 0
logger.warn('message'); // nivel 1
logger.info('message'); // nivel 2
logger.http('message'); // nivel 3
logger.verbose('message'); // nivel 4
logger.debug('message'); // nivel 5
```

En el modo de desarrollo, los mensajes de registro de todos los niveles de gravedad se imprimirán en la consola.

En el modo de producción, solo se imprimirán en la consola los registros `info`,` warn` y `error`. \
Depende del servidor (o administrador de procesos) leerlos desde la consola y almacenarlos en archivos de registro. \
Esta aplicación utiliza pm2 en modo de producción, que ya está configurado para almacenar los registros en archivos de registro.

## Plugins Custom para Mongoose

La aplicación también contiene 3 complementos personalizados de mangosta que puede adjuntar a cualquier esquema de modelo de mangosta. Puede encontrar los complementos en `src / models / plugins`.

```javascript
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userSchema = mongoose.Schema(
  {
    /* schema definition here */
  },
  { timestamps: true }
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

const User = mongoose.model('User', userSchema);
```

### toJSON

El complemento toJSON aplica los siguientes cambios en la llamada de transformación toJSON:

- elimina \ _ \ _ v, createdAt, updatedAt y cualquier ruta de esquema que tenga private: true
- reemplaza \ _id con id

### paginate

El complemento paginate agrega el método estático `paginate` al esquema de mangosta.

Agregar este complemento al esquema del modelo `Usuario` le permitirá hacer lo siguiente:

```javascript
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};
```

El parámetro `filter` es un filtro mongo regular.

El parámetro `options` puede tener los siguientes campos (opcionales):

```javascript
const options = {
  sortBy: 'name:desc', // ordenar por
  limit: 5, // maximo de resultados por página
  page: 2, // numero de página
};
```

El complemento también admite la clasificación por varios criterios (separados por una coma): `sortBy: name: desc, role: asc`

El método `paginate` devuelve una Promise, que cumple con un objeto que tiene las siguientes propiedades:

```json
{
  "results": [],
  "page": 2,
  "limit": 5,
  "totalPages": 10,
  "totalResults": 48
}
```

### autoIncrement

Para autoincrementar el número de orden en el modelo de ordenes, se utiliza el paquete npm `mongoose-auto-increment`(https://www.npmjs.com/package/mongoose-auto-increment)

## Limiter
Se implemento un limiter para los request fallidos a los endpoints de auth, utilizando el paquete `express-rate-limit`(https://www.npmjs.com/package/express-rate-limit)

## Aclaraciones

#### Duracion del tiempo de sesión
Se puede configurar en las variables de entorno

#### Configuracion de diversos entornos
No se generaron varios archivos .env debido a la recomendación de la misma libreria, en su lugar se utilizo un archivo config que obtiene las variables de .env y luego modifica la configuración en base al entorno (Desarrollo o Producción).

#### Fecha y hora de las ordenes
Se obtiene mediante los campos createdAt y updatedAt que mongoose agrega al pasarle la configuración "timestamps" al modelo

