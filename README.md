# CMELI
--Challenge Tecnico MELI

Este desarrollo comprende el desafio tecnico propuesto por Mercado libre y se basa en la lectura y procesamiento de datos provenientes de archivos en diferentes formatos como '.csv', '.txt', '.jsonline', '.json'. Con estos datos se realizan consltas a diferentes API de Marcado Libre y almacena los objetos procesados de esas consultas en una base de datos.

-- Objetivos del proyecto

1. Lectura de archivos:
El proyecto permite la lectura de archivos en distintos formatos: '.csv', '.txt', '.jsonline', '.json'.
Implementar una solucion versatil para que se adapte a los distintos tipos de archivos.
2. Procesamiento de datos:
Procesa los datos de los archivos ingresados, unifica las columnas 'site' y 'id' para obtener parametros de busqueda.
3. Consulta a la API de Mercado libre:
Realiza multiples consultas a la API de Mercado Libre, incluyendio consultas a partir de otras consultas con el fin de obtener informacion y organizarla en datos de interes especifico.
4. Almacenamiento en Base de datos:
Establece la conexion con una base de datos contenida en Docker para almacenar los objetos procesados, teniendo como resultado una informacion organizada.


-- Guia de Uso

1. Tecnologias utilizadas:

Descargue y clone el repositorio:

    git clone https://github.com/grpuertoa/CMELI 

Para la ejecucion de la aplicacion en general es necesario contar con:
        Instalacion nodeJS: https://nodejs.org/.

Para la ejecucion del contenedor es ncesario contar con:
        Instalacion de Docker compose : https://www.docker.com/get-started.

Para la ejecucion de la base de datos es necesario contar con:
        Instalacion de Mongodb cOMPASS: https://www.mongodb.com/try/download/compass.


2. Configuracion del entorno:

Para inciar hay que configurar el contenedor de la base de datos y la base de datos, debe ejecutar Docker compose desde el directorio del proyecto clonado y ejecutar el comando para inciar el contenedor:

    docker-compose -f docker-compose.yml  up

Con este codigo, se creara y ejecutara el contenedor junto a la base de datos.

Proceda a instalar las dependencias del proyecto incuidas en el package.json

    "axios": "^1.6.7",
    "express": "^4.18.2",
    "fast-csv": "^5.0.1",
    "JSONStream": "^1.3.5",
    "mongodb": "^6.3.0",
    "mongoose": "^8.1.3",
    "multer": "^1.4.5-lts.1"

Dentro del directorio donde clono el respositorio ejecute el comando npm para instalar todas las dependencias necesarias:

npm install


Ejecute la aplicacion:

node app.js


Tenga en cuenta que es una implementacion de backend, debe utilizarla por medio de un software cliente API o cliente HTTP como Postman o Insomnia dependiendo su preferencia.

3. Acceder a Base de datos:

iNGRESE A mongo Compass y a traves del Mongo URI disponible en el archivo de dataBase.js conectese a la base de datos, alli podra consultar los elementos que se agreguen a la misma.

        mongoURI: "mongodb://cmeli:cmeli2002@localhost:27020",

4. Notas:

Debe asegurarse que no existan conflictos de puertos en su equipo de ejecucion de la aplicacion, ajuste los puertos en el archivo 'docker-compose.yml' si es necesario.

La aplicacion soporta procesamiento de datos de tipo '.csv', '.txt', '.jsonline', '.json' los cuales se componen de 2 columnas, site y id.
En caso que suba un archivo '.csv' , recuerde incluir en los params del body: 
        key: delimiter 
        value: , (o el delimitador que necesite)

Si no modifica las configuraciones del app.js en terminos de puertos de ejecucion el andpoint para ejecutar la aplicacion seria:

        http://127.0.0.1:3009/load-file
        key             value
        file            <tu-arachivo.(.csv - .jsonl - .txt - .json)>
        delimiter       , (en caso de ser .csv)