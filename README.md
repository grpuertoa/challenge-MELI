# CMELI

## Challenge Tecnico MELI

Este desarrollo comprende el desafio tecnico propuesto por Mercado libre y se basa en la lectura y procesamiento de datos provenientes de archivos en diferentes formatos como '.csv', '.txt', '.jsonline', '.json'. Con estos datos se realizan consltas a diferentes API de Marcado Libre y almacena los objetos procesados de esas consultas en una base de datos.

## Objetivos del proyecto

1.  Lectura de archivos: El proyecto permite la lectura de archivos en distintos formatos: '.csv', '.txt', '.jsonline', '.json'.
2.  Procesamiento de datos: Procesa los datos de los archivos ingresados, unifica las columnas 'site' y 'id' para obtener parametros de busqueda.
3.  Consulta a la API de Mercado libre: Realiza multiples consultas a la API de Mercado Libre, incluyendio consultas a partir de otras consultas con el fin de obtener informacion y organizarla en datos de interes especifico.
4.  Almacenamiento en Base de datos: Establece la conexión con una base de datos contenida en Docker para almacenar los objetos procesados, teniendo como resultado una información organizada.

## Guia de Uso

###  1. Tecnologias utilizadas:

Descargue y clone el repositorio:

```
    git clone https://github.com/grpuertoa/challenge-MELI
```

 - Para la ejecucion de la aplicacion en general es necesario contar con
   [NodeJS](https://nodejs.org/)     
  - Para la ejecucion del contenedor es
   necesario contar con instalacion de Docker compose :
   [Docker](https://www.docker.com/get-started) 
   - Para la ejecucion de la
   base de datos es necesario contar con: [MongoDB Compass](https://www.mongodb.com/try/download/compass)
### 2. Configuracion del entorno:

Para inciar hay que configurar el contenedor de la base de datos y la base de datos, debe ejecutar Docker compose desde el directorio del proyecto clonado y ejecutar el comando para inciar el contenedor:

```
docker-compose -f docker-compose.yml  up
```

Con este codigo, se creara y ejecutara el contenedor junto a la base de datos.

Proceda a instalar las dependencias del proyecto incuidas en el package.json Dentro del directorio donde clono el respositorio ejecute el comando npm para instalar todas las dependencias necesarias:

```
npm install

"axios": "^1.6.7",
"express": "^4.18.2",
"fast-csv": "^5.0.1",
"JSONStream": "^1.3.5",
"mongodb": "^6.3.0",
"mongoose": "^8.1.3",
"multer": "^1.4.5-lts.1"

```

### 3. Ejecute la aplicacion:

```
node app.js
```

Tenga en cuenta que es una implementacion de backend, debe utilizarla por medio de un software cliente API o cliente HTTP como Postman o Insomnia dependiendo su preferencia.

### 4.  Acceder a Base de datos:

Ingrese a mongo Compass y a traves del Mongo URI disponible en el archivo de dataBase.js conectese a la base de datos,     alli podra consultar de manera visual y sencilla los elementos que se agreguen a la misma.

```
        mongoURI: "mongodb://cmeli:cmeli2002@localhost:27020",
```

### 5.  Notas:

Debe asegurarse que no existan conflictos de puertos en su equipo de ejecucion de la aplicacion, ajuste los puertos en el archivo 'docker-compose.yml' si es necesario.
    
La aplicacion soporta procesamiento de datos de tipo '.csv', '.txt', '.jsonline', '.json' los cuales se componen de 2 columnas, site y id. En caso que suba un archivo '.csv' , recuerde incluir en los params del body: key: delimiter value: , (o el delimitador que necesite)

Dentro del repositorio encuentra una carpeta test files, alli hay archivos de prueba para ejecutar la aplicacion.

Si no modifica las configuraciones del app.js en terminos de puertos de ejecucion el endpoint para ejecutar la aplicacion seria:
```
        Peticion tipo: POST
        
            http://127.0.0.1:3009/load-file
            
        key             value
        file            <tu-arachivo.(.csv - .jsonl - .txt - .json)>
        delimiter       , (en caso de ser .csv)
```

Diagrama de arquitectura del proyecto:

![arquitectura](/src/uploads/architecture.png)

### 6. Pruebas unitarias:

Se utilizo la libreria jest para la realizacion de diversas pruebas unitarias, estas abarcan test el los procesadores de archivos, tanto para comprobar la eficacia en procesar archivos esperados, como pruebas para comprobar mensajes de error cuando no se usa un delimiter en los archivos .csv o cuando se ingresa un formato no soportado.

De igual modo se realizan pruebas unitarias para las API y las respuestas recibidas de ellas, pruebas para todos los request exitosos asi como pruebas para id inexistentes o undefined.

Para ejecutar las pruebas unitarias despues de instalar todas las dependencias en el paso 2 debe correr el comando:

```

npm run test

```

Tenga en cuenta que para las pruebas del procesador de archivos este utiliza los archivos disponibles en la carpeta de uploads entonces siempre deben estar disponibles los archivos en ese directorio que estan adjuntos en este repositorio.