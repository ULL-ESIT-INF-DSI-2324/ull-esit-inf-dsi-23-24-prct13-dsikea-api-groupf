# Práctica 13 - DSIkea: API REST con Node/Express
---

- Grupo: F
- Alumnos: José Ángel Marrero Domínguez y Sebastián André Porto Specht
- Correos: *alu0101494500* y *alu0101494265*
- Asignatura: **Desarrollo de Sistemas Informáticos** (DSI)

---

## Índice

- [Introducción](#introducción)
- [Objetivos](#objetivos)
- [Tests y Código Implementado](#tests-y-código-implementado)
- [Conclusión](#conclusión)
- [Bibliografía](#bibliografía)

---

## Introducción

En el marco de la asignatura Desarrollo de Sistemas Informáticos (DSI), se presenta la práctica número 13, denominada DSIkea: API REST con Node/Express. Esta práctica constituye una oportunidad para aplicar los conocimientos adquiridos durante el curso en el desarrollo de sistemas web utilizando tecnologías modernas.

---

## Objetivos

El principal objetivo de esta práctica es diseñar y desarrollar un API RESTful utilizando Node.js y Express para gestionar una tienda de muebles ficticia, denominada DSIkea. Los objetivos específicos incluyen:

1. Implementar operaciones CRUD (Crear, Leer, Actualizar y Borrar) para las entidades principales de la tienda de muebles: clientes, proveedores, muebles y transacciones.
2. Utilizar MongoDB/MongoDB Atlas como sistema de base de datos no relacional, junto con Mongoose para la gestión de la base de datos desde Node.js.
3. Aplicar buenas prácticas de diseño de APIs RESTful, incluyendo el uso de rutas, verbos HTTP adecuados y manejo de errores.
4. Desarrollar de manera defensiva, anticipando y manejando posibles errores y situaciones excepcionales que puedan surgir durante el uso del API.
5. Documentar exhaustivamente el código desarrollado, incluyendo comentarios claros y concisos en el código fuente y generando una documentación externa que explique el funcionamiento del API y cómo utilizarlo.
6. Realizar pruebas unitarias y de integración para garantizar la funcionalidad correcta del API en diferentes escenarios.
7. Desplegar el API en Render con la base de datos de MongoDB Atlas desplegada en la nube.

---

## Tests y Código Implementado

### Código Implementado

#### mongoose.ts
Este archivo establece la conexión con la base de datos MongoDB utilizando Mongoose, una librería de modelado de objetos para Node.js.

Primero, importa la función connect de Mongoose para establecer la conexión. Luego, intenta conectar con la base de datos utilizando la URL proporcionada en la variable de entorno MONGODB_URL.

Si la conexión es exitosa, se muestra un mensaje en la consola indicando que la conexión se ha establecido correctamente. En caso de que ocurra algún error durante la conexión, se captura y se muestra en la consola.

#### customer.ts

Este archivo define el modelo `Customer` para representar los datos de los clientes en la base de datos. Utiliza Mongoose para definir el esquema y la interfaz del cliente.

- **CustomerInterface**: Define la interfaz para los documentos de cliente, que incluye campos como nombre, NIF (Número de Identificación Fiscal), dirección, correo electrónico y número de teléfono.

- **customerSchema**: Define el esquema del cliente utilizando la clase `Schema` de Mongoose. Este esquema especifica los campos del cliente, sus tipos de datos, restricciones y validaciones.

  - **name**: Nombre del cliente. Se define como una cadena de texto que debe empezar con una letra mayúscula.
  
  - **nif**: NIF del cliente. Se define como una cadena de texto única de exactamente 9 caracteres alfanuméricos que cumple con ciertos patrones de validación.
  
  - **address**: Dirección del cliente. Se define como una cadena de texto.
  
  - **email**: Correo electrónico del cliente. Se define como una cadena de texto que debe tener un formato de correo electrónico válido.
  
  - **phone**: Número de teléfono del cliente. Se define como una cadena de texto única que debe cumplir con ciertas condiciones para ser considerado válido.

- **Customer**: Define el modelo de cliente utilizando la función `model` de Mongoose, que toma como argumentos el nombre del modelo y el esquema correspondiente. Este modelo se exporta para que pueda ser utilizado en otras partes de la aplicación.

#### provider.ts

Este archivo define el modelo `Provider` para representar los datos de los proveedores en la base de datos. Utiliza Mongoose para definir el esquema y la interfaz del proveedor.

- **ProviderInterface**: Define la interfaz para los documentos de proveedor, que incluye campos como nombre, CIF (Código de Identificación Fiscal), dirección, correo electrónico y número de teléfono.

- **providerSchema**: Define el esquema del proveedor utilizando la clase `Schema` de Mongoose. Este esquema especifica los campos del proveedor, sus tipos de datos, restricciones y validaciones.

  - **name**: Nombre del proveedor. Se define como una cadena de texto que debe empezar con una letra mayúscula.
  
  - **cif**: CIF del proveedor. Se define como una cadena de texto única de exactamente 9 caracteres alfanuméricos que cumple con ciertos patrones de validación.
  
  - **address**: Dirección del proveedor. Se define como una cadena de texto.
  
  - **email**: Correo electrónico del proveedor. Se define como una cadena de texto que debe tener un formato de correo electrónico válido.
  
  - **phone**: Número de teléfono del proveedor. Se define como una cadena de texto única que debe cumplir con ciertas condiciones para ser considerado válido.

- **Provider**: Define el modelo de proveedor utilizando la función `model` de Mongoose, que toma como argumentos el nombre del modelo y el esquema correspondiente. Este modelo se exporta para que pueda ser utilizado en otras partes de la aplicación.

#### furniture.ts

Este archivo define el esquema del modelo de datos para los muebles y exporta el modelo `Furniture` utilizando Mongoose. El modelo incluye las siguientes propiedades:

- **type**: Tipo de mueble, representado como una cadena. Es obligatorio y se valida mediante una lista de valores permitidos (enum).
- **name**: Nombre del mueble, una cadena única que debe comenzar con una letra mayúscula.
- **description**: Descripción del mueble, una cadena que describe las características del mueble.
- **color**: Color del mueble, una cadena que representa el color del mueble.
- **dimensions**: Dimensiones del mueble, una cadena que describe las dimensiones físicas del mueble.
- **price**: Precio del mueble, un número que representa el costo del mueble. Debe ser mayor o igual a cero.
- **stock**: Stock del mueble, un número que indica la cantidad disponible en el inventario. Debe ser mayor o igual a cero.

El esquema define restricciones de validación para garantizar que los datos cumplan con ciertos criterios antes de ser almacenados en la base de datos. Por ejemplo, el nombre del mueble debe comenzar con una letra mayúscula y no debe haber nombres duplicados. El precio y el stock deben ser valores numéricos no negativos. El tipo de mueble se valida mediante una lista predefinida de valores permitidos. Si alguna de estas validaciones falla, se lanzará un error. El modelo `Furniture` se utiliza luego en las rutas para interactuar con la base de datos y realizar operaciones CRUD sobre los muebles.

#### transaction.ts

Este archivo define el esquema del modelo de datos para las transacciones y exporta el modelo `Transaction` utilizando Mongoose. El modelo incluye las siguientes propiedades:

- **entity**: Representa la entidad involucrada en la transacción, que puede ser un proveedor o un cliente. Se almacena como un objeto que incluye un tipo (referencia a `ProviderInterface` o `CustomerInterface`) y opcionalmente un NIF (para el cliente) o un CIF (para el proveedor).
- **type**: Tipo de transacción, que puede ser una orden de compra, una orden de venta, un reembolso del cliente o un reembolso al proveedor.
- **furniture**: Array que contiene los muebles involucrados en la transacción, cada uno representado como un objeto que incluye el nombre del mueble, su descripción, color, dimensiones, precio y cantidad.
- **dateTime**: Fecha y hora de la transacción, almacenada como un objeto Date. Por defecto, se establece en la fecha y hora actuales.
- **observations**: Observaciones adicionales sobre la transacción, almacenadas como una cadena de texto.
- **totalAmount**: Importe total de la transacción.

El esquema define restricciones de validación para garantizar que los datos cumplan con ciertos criterios antes de ser almacenados en la base de datos. Por ejemplo, el tipo de transacción se valida mediante una lista predefinida de valores permitidos. El nombre del mueble se valida como una referencia al modelo `Furniture`, y la cantidad debe ser un número entero positivo mayor que cero.

El modelo `Transaction` se utiliza luego en las rutas para interactuar con la base de datos y realizar operaciones CRUD sobre las transacciones.

#### default.ts

Este archivo define un router que maneja todas las solicitudes para rutas que no coinciden con ninguna otra ruta definida en la aplicación. Utiliza el método `all` de Express para capturar todas las solicitudes HTTP (GET, POST, PUT, DELETE, etc.) para cualquier ruta que no haya sido manejada previamente por otro router.

Cuando una solicitud llega a una ruta no definida, este router responde con un código de estado HTTP 501 (Not Implemented), indicando que el servidor no reconoce o no admite el método de solicitud utilizado.

Este enfoque puede ser útil para garantizar que todas las solicitudes reciban una respuesta, incluso si no coinciden con ninguna ruta específica definida en la aplicación.

#### customers.ts

Este archivo define un router para gestionar las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) relacionadas con los clientes. Aquí están las operaciones definidas:

1. **Crear un nuevo cliente**: Maneja las solicitudes POST en la ruta '/customers'. Crea un nuevo cliente con los datos proporcionados en el cuerpo de la solicitud y lo guarda en la base de datos.

2. **Obtener clientes**: Maneja las solicitudes GET en la ruta '/customers'. Recupera todos los clientes que coinciden con el filtro proporcionado en la consulta. Si no se proporciona ningún filtro, se devuelven todos los clientes.

3. **Obtener un cliente por ID**: Maneja las solicitudes GET en la ruta '/customers/:id'. Busca un cliente por su ID y lo devuelve si se encuentra.

4. **Actualizar un cliente por NIF o ID**: Maneja las solicitudes PATCH en las rutas '/customers' (por NIF) y '/customers/:id' (por ID). Actualiza un cliente según los datos proporcionados en el cuerpo de la solicitud.

5. **Eliminar un cliente por NIF o ID**: Maneja las solicitudes DELETE en las rutas '/customers' (por NIF) y '/customers/:id' (por ID). Elimina un cliente según el filtro proporcionado en la consulta o por su ID.

Estas rutas proporcionan una interfaz para interactuar con la colección de clientes en la base de datos, permitiendo crear, leer, actualizar y eliminar clientes según sea necesario.

#### providers.ts

Este archivo define un router para gestionar las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) relacionadas con los proveedores. Aquí están las operaciones definidas:

1. **Crear un nuevo proveedor**: Maneja las solicitudes POST en la ruta '/providers'. Crea un nuevo proveedor con los datos proporcionados en el cuerpo de la solicitud y lo guarda en la base de datos.

2. **Obtener proveedores**: Maneja las solicitudes GET en la ruta '/providers'. Recupera todos los proveedores que coinciden con el filtro proporcionado en la consulta. Si no se proporciona ningún filtro, se devuelven todos los proveedores.

3. **Obtener un proveedor por ID**: Maneja las solicitudes GET en la ruta '/providers/:id'. Busca un proveedor por su ID y lo devuelve si se encuentra.

4. **Actualizar un proveedor por CIF o ID**: Maneja las solicitudes PATCH en las rutas '/providers' (por CIF) y '/providers/:id' (por ID). Actualiza un proveedor según los datos proporcionados en el cuerpo de la solicitud.

5. **Eliminar un proveedor por CIF o ID**: Maneja las solicitudes DELETE en las rutas '/providers' (por CIF) y '/providers/:id' (por ID). Elimina un proveedor según el filtro proporcionado en la consulta o por su ID.

Estas rutas proporcionan una interfaz para interactuar con la colección de proveedores en la base de datos, permitiendo crear, leer, actualizar y eliminar proveedores según sea necesario.

#### furnitures.ts

El archivo `furnitures.ts` define un router para gestionar las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) relacionadas con los muebles. Aquí están las operaciones definidas:

1. **Crear un nuevo mueble**: Maneja las solicitudes POST en la ruta '/furnitures'. Crea un nuevo mueble con los datos proporcionados en el cuerpo de la solicitud y lo guarda en la base de datos.

2. **Obtener muebles por nombre, descripción, color o todos ellos**: Maneja las solicitudes GET en la ruta '/furnitures'. Recupera todos los muebles que coinciden con los filtros proporcionados en la consulta. Si no se proporciona ningún filtro, se devuelven todos los muebles.

3. **Obtener un mueble por ID**: Maneja las solicitudes GET en la ruta '/furnitures/:id'. Busca un mueble por su ID y lo devuelve si se encuentra.

4. **Actualizar un mueble por nombre, descripción, color o todos ellos**: Maneja las solicitudes PATCH en la ruta '/furnitures' y '/furnitures/:id'. Actualiza un mueble según los datos proporcionados en el cuerpo de la solicitud y el filtro opcional por ID.

5. **Eliminar un mueble por nombre, descripción, color o todos ellos**: Maneja las solicitudes DELETE en la ruta '/furnitures' y '/furnitures/:id'. Elimina un mueble según los filtros proporcionados en la consulta o por su ID.

Estas rutas proporcionan una interfaz para interactuar con la colección de muebles en la base de datos, permitiendo crear, leer, actualizar y eliminar muebles según sea necesario.

#### transactions.ts

El archivo `transactions.ts` define un router para manejar las operaciones CRUD relacionadas con las transacciones. Aquí está un resumen de las operaciones definidas:

1. **Crear una nueva transacción**: Maneja las solicitudes POST en la ruta '/transactions'. Crea una nueva transacción con los datos proporcionados en el cuerpo de la solicitud, valida la entidad asociada y los muebles involucrados, y luego la guarda en la base de datos.

2. **Obtener transacciones por rango de fechas, tipo, CIF/NIF o todos ellos**: Maneja las solicitudes GET en la ruta '/transactions'. Recupera las transacciones que coinciden con los filtros proporcionados en la consulta, como el rango de fechas, el tipo de transacción y la identificación de la entidad (proveedor o cliente).

3. **Obtener una transacción por ID**: Maneja las solicitudes GET en la ruta '/transactions/:id'. Busca una transacción por su ID y la devuelve si se encuentra.

4. **Actualizar una transacción por ID**: Maneja las solicitudes PATCH en la ruta '/transactions/:id'. Actualiza una transacción según los datos proporcionados en el cuerpo de la solicitud y el ID de la transacción. Esto implica validar y actualizar los muebles involucrados y recalcular el importe total de la transacción.

5. **Eliminar una transacción por ID**: Maneja las solicitudes DELETE en la ruta '/transactions/:id'. Elimina una transacción según su ID.

Estas rutas permiten crear, leer, actualizar y eliminar transacciones, proporcionando una interfaz para interactuar con la colección de transacciones en la base de datos.

#### index.ts

El archivo `index.ts` inicializa la aplicación Express y configura las rutas para los diferentes recursos de la API, como clientes, proveedores, muebles y transacciones. Aquí está el resumen:

1. Importa Express y el archivo de configuración de la base de datos (`mongoose.js`).
2. Importa los routers para los diferentes recursos de la API: `customerRouter`, `providerRouter`, `furnitureRouter`, `transactionRouter` y `defaultRouter`.
3. Configura la aplicación Express utilizando `express.json()` para analizar el cuerpo de las solicitudes entrantes como JSON.
4. Asocia cada router con su correspondiente prefijo de ruta utilizando `app.use()`.
5. Configura el puerto del servidor para escuchar las solicitudes entrantes. Utiliza el puerto proporcionado por la variable de entorno `process.env.PORT` o el puerto 3000 de forma predeterminada.
6. Inicia el servidor y lo hace escuchar en el puerto configurado, mostrando un mensaje en la consola indicando que el servidor está arriba y funcionando.

Este archivo inicializa la API y la hace accesible para manejar las solicitudes HTTP relacionadas con clientes, proveedores, muebles, transacciones y rutas predeterminadas.

### Tests

#### customers.spec.ts

Este archivo contiene una serie de pruebas para el recurso "clientes" de la API. Aquí tienes un resumen de las pruebas realizadas:

1. **Creación de Cliente**:
   - Se realizan pruebas para crear un nuevo cliente y se verifica que la solicitud sea exitosa (estado 201).
   - Se comprueba que los datos del cliente creado coincidan con los proporcionados en la solicitud.

2. **Validaciones de Creación de Cliente**:
   - Se realizan pruebas para verificar que se generen errores al intentar crear un cliente con formatos de datos incorrectos o faltantes (nombre, NIF, email, etc.).
   - Se verifica que se reciba el código de estado 400 en caso de error.

3. **Validaciones de NIF, Email y Teléfono Únicos**:
   - Se realizan pruebas para verificar que no se pueda crear un cliente con un NIF, email o teléfono que ya exista en la base de datos.
   - Se verifica que se reciba el código de estado 400 en caso de intentar crear un cliente con datos duplicados.

4. **Obtención de Clientes**:
   - Se realizan pruebas para obtener todos los clientes y se verifica que la solicitud sea exitosa (estado 200).
   - Se comprueba que la respuesta contenga la cantidad esperada de clientes.

5. **Obtención de Cliente por NIF**:
   - Se realizan pruebas para obtener un cliente por su NIF y se verifica que la solicitud sea exitosa (estado 200).
   - Se comprueba que la respuesta contenga el cliente esperado.

6. **Obtención de Cliente por ID**:
   - Se realizan pruebas para obtener un cliente por su ID y se verifica que la solicitud sea exitosa (estado 200).
   - Se comprueba que la respuesta contenga el cliente esperado.

7. **Actualización de Cliente por NIF o ID**:
   - Se realizan pruebas para actualizar un cliente por su NIF o ID y se verifica que la solicitud sea exitosa (estado 200).
   - Se comprueba que los datos del cliente se hayan actualizado correctamente.

8. **Validaciones de Actualización de Cliente**:
   - Se realizan pruebas para verificar que se generen errores al intentar actualizar un cliente con datos incorrectos.
   - Se verifica que se reciba el código de estado 400 en caso de error.

9. **Eliminación de Cliente por NIF o ID**:
   - Se realizan pruebas para eliminar un cliente por su NIF o ID y se verifica que la solicitud sea exitosa (estado 200).
   - Se comprueba que el cliente haya sido eliminado de la base de datos.

10. **Validaciones de Eliminación de Cliente**:
    - Se realizan pruebas para verificar que se generen errores al intentar eliminar un cliente con un ID inválido.
    - Se verifica que se reciba el código de estado 404 en caso de error.

#### providers.spec.ts

El archivo `providers.spec.ts` contiene una serie de pruebas unitarias para la funcionalidad relacionada con los proveedores en tu aplicación. Aquí está un resumen de las pruebas que se realizan:

1. **Creación de Proveedores**: Se prueban las solicitudes para crear nuevos proveedores, verificando que los datos ingresados se guarden correctamente en la base de datos y que se devuelva el código de estado 201 (creado).

2. **Validación de Formato de Datos**: Se realizan pruebas para verificar que los datos ingresados cumplan con los formatos esperados. Se incluyen casos de nombres inválidos, CIFs (Código de Identificación Fiscal) inválidos y correos electrónicos inválidos. Se espera que se devuelva el código de estado 400 (solicitud incorrecta) en caso de que los datos no cumplan con los requisitos.

3. **Validación de Valores Requeridos**: Se prueban las solicitudes para crear proveedores sin proporcionar todos los valores requeridos. Se espera que se devuelva el código de estado 400 en estos casos.

4. **Duplicación de Datos**: Se realizan pruebas para verificar que no se puedan crear proveedores con datos que ya existen en la base de datos. Se incluyen casos de CIFs duplicados, correos electrónicos duplicados y números de teléfono duplicados. Se espera que se devuelva el código de estado 400 en caso de que se intente crear un proveedor con datos duplicados.

5. **Obtención de Proveedores**: Se prueban las solicitudes para obtener todos los proveedores y para obtener un proveedor específico por su CIF o ID. Se espera que se devuelva el código de estado 200 (OK) cuando se encuentren los datos solicitados y el código de estado 404 (no encontrado) cuando no se encuentren.

6. **Actualización de Proveedores**: Se prueban las solicitudes para actualizar proveedores tanto por su CIF como por su ID. Se incluyen casos para actualizar el nombre, la dirección, el correo electrónico y el número de teléfono. Se espera que se devuelva el código de estado 200 cuando la actualización sea exitosa y el código de estado 404 cuando el proveedor no sea encontrado.

7. **Eliminación de Proveedores**: Se prueban las solicitudes para eliminar proveedores tanto por su CIF como por su ID. Se espera que se devuelva el código de estado 200 cuando la eliminación sea exitosa y el código de estado 404 cuando el proveedor no sea encontrado.

#### furnitures.spec.ts

El archivo `furnitures.spec.ts` contiene una serie de pruebas unitarias para la funcionalidad relacionada con los muebles en tu aplicación. Aquí está un resumen de las pruebas que se realizan:

1. **Creación de Muebles**: Se prueban las solicitudes para crear nuevos muebles, verificando que los datos ingresados se guarden correctamente en la base de datos y que se devuelva el código de estado 201 (creado).

2. **Validación de Datos Requeridos**: Se prueban las solicitudes para crear muebles sin proporcionar todos los valores requeridos. Se espera que se devuelva el código de estado 400 en estos casos.

3. **Validación de Formato de Datos**: Se realizan pruebas para verificar que los datos ingresados cumplan con los formatos esperados. Se incluyen casos de nombres inválidos y tipos de muebles no permitidos. Se espera que se devuelva el código de estado 400 en caso de que los datos no cumplan con los requisitos.

4. **Obtención de Muebles**: Se prueban las solicitudes para obtener todos los muebles y para obtener un mueble específico por su nombre o ID. Se espera que se devuelva el código de estado 200 (OK) cuando se encuentren los datos solicitados y el código de estado 404 (no encontrado) cuando no se encuentren.

5. **Actualización de Muebles**: Se prueban las solicitudes para actualizar muebles tanto por su nombre como por su ID. Se espera que se devuelva el código de estado 200 cuando la actualización sea exitosa y el código de estado 404 cuando el mueble no sea encontrado.

6. **Eliminación de Muebles**: Se prueban las solicitudes para eliminar muebles tanto por su nombre como por su ID. Se espera que se devuelva el código de estado 200 cuando la eliminación sea exitosa y el código de estado 404 cuando el mueble no sea encontrado.

#### transactions.spec.ts

El archivo `transactions.spec.ts` contiene una serie de pruebas unitarias para la funcionalidad relacionada con las transacciones en tu aplicación. Aquí está un resumen de las pruebas que se realizan:

1. **Creación de Transacciones**: Se prueban las solicitudes para crear diferentes tipos de transacciones, como órdenes de venta, órdenes de compra, reembolsos de clientes y reembolsos a proveedores. Se verifica que los datos ingresados se guarden correctamente en la base de datos y que se devuelva el código de estado 201 (creado).

2. **Validación de Datos Requeridos**: Se prueban las solicitudes para crear transacciones sin proporcionar todos los valores requeridos. Se espera que se devuelva el código de estado 400 en estos casos.

3. **Validación de Entidades y Tipos de Transacciones**: Se prueban las solicitudes para crear transacciones con entidades y tipos de transacciones válidos. Se espera que se devuelva el código de estado 400 en caso de que los datos no cumplan con los requisitos.

4. **Obtención de Transacciones**: Se prueban las solicitudes para obtener todas las transacciones y para obtener transacciones filtradas por rango de fechas, tipo de transacción y entidad asociada. Se espera que se devuelva el código de estado 200 (OK) cuando se encuentren los datos solicitados y el código de estado 400 (error de solicitud) cuando los filtros no sean válidos.

5. **Actualización de Transacciones**: Se prueban las solicitudes para actualizar transacciones por su ID. Se verifica que la actualización sea exitosa y que se devuelva el código de estado 200. También se prueban escenarios donde se intenta actualizar transacciones con identificadores inválidos o actualizaciones no permitidas, esperando códigos de estado 400 en esos casos.

6. **Eliminación de Transacciones**: Se prueban las solicitudes para eliminar transacciones por su ID. Se espera que se devuelva el código de estado 200 cuando la eliminación sea exitosa y el código de estado 400 cuando el identificador de la transacción no sea válido.

---

## Conclusión

En esta práctica de desarrollo de un API REST con Node.js y Express para gestionar una tienda de muebles ficticia, denominada DSIkea, hemos logrado alcanzar los objetivos planteados, aplicando los conocimientos adquiridos durante el curso en el desarrollo de sistemas web utilizando tecnologías modernas.

Al analizar la implementación del método findOneAndUpdate en la operación de actualización parcial (PATCH) de los muebles, hemos observado que esta función actualiza la primera entrada de la consulta que cumple los filtros, incluso si existen múltiples resultados que cumplen con los criterios de búsqueda. Este comportamiento puede generar resultados inesperados si no se tiene en cuenta adecuadamente al diseñar y realizar operaciones de actualización en la base de datos.

Además, al gestionar las órdenes de venta (Sell Order), hemos observado que si se compra exactamente la cantidad de muebles que hay en stock, el stock se actualiza a 0 en nuestra base de datos de muebles. Esta decisión se basa en la premisa de que el cliente todavía puede devolver dicho pedido (Refund from client), lo que implicaría la reposición del stock. Es importante tener en cuenta esta lógica al diseñar y gestionar las transacciones de venta en el sistema.

Durante el desarrollo de la práctica, nos enfrentamos a varios errores y dificultades. En primer lugar, experimentamos solapamientos en las bases de datos durante las pruebas, debido a la falta de configuración adecuada al realizar git push. Para resolver este problema, implementamos un directorio de configuración con archivos de entorno .env.

Además, al desplegar el proyecto en Render y realizar pruebas con Thunder Client en Visual Studio Code, nos encontramos con el error 502 Bad Gateway, que ralentizó nuestras pruebas para verificar el correcto funcionamiento de las peticiones HTTP. Esta dificultad nos permitió aprender sobre la importancia de la gestión de errores y la depuración en entornos de despliegue en la nube.

En resumen, la práctica nos ha brindado una experiencia valiosa en el diseño, desarrollo y despliegue de un API REST utilizando tecnologías modernas, así como la resolución de problemas y la gestión de errores en un entorno de desarrollo real.

---

## Bibliografía

- [Enunciado de la práctica](https://ull-esit-inf-dsi-2324.github.io/prct13-DSIkea-api/)
- [Principios Solid](https://samueleresca.net/solid-principles-using-typescript/)
- [Instanbul](https://istanbul.js.org/)
- [Coveralls](https://coveralls.io/)
- [TypeDoc](https://typedoc.org/)
- [Mocha](https://mochajs.org/)
- [Chai](https://www.chaijs.com/)
- [MongoDB](https://www.mongodb.com/cloud/atlas/)
- [Render](https://render.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [SonarCloud](https://sonarcloud.io)
- [Guía de Markdown](https://markdown.es/sintaxis-markdown/#links)
- [Apuntes de la asignatura](https://ull-esit-inf-dsi-2324.github.io/nodejs-theory/)
- [Repositorio en Github de la práctica](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupf)