Traspaso de Aplicación a Otra Máquina (Visual Studio Code)
Requisitos Previos de Hardware:
. Procesador: Intel Core i3 o superior.
. Espacio en disco: Mínimo 50 GB.
. Memoria RAM: 8 GB o más.

Requisitos Previos de Software:
. Editor de Código: Preferiblemente Visual Studio Code.
. Sistema Operativo: Windows 10/11.
. Node.js: Versiones desde 20.15.1 hasta la más reciente.
. SQL Server: Versión 16.0.
.Navegador: Google Chrome, Edge, o Opera GX.

--------------------------------------------------------------

*Pasos para Instalar Node.js*

1. Visita el siguiente enlace: Node.js.
2. Selecciona la opción "Download Node.js (LTS)".
3. Una vez completada la descarga, haz clic en el archivo descargado.
4. Sigue las instrucciones del instalador, seleccionando "Next" en cada paso, y acepta la licencia.

-----------------------------------------------------------------

*Configuración de la Base de Datos*

entre los archivos proporcionados habra un descargable que contendra la aplicacion de SQL SERVER denominado "sql2022"
y otro que contendra el SQLSERVER MANAGEMENT  denominado "SSMS", luego de abrir primero el sql2022 seguir los pasos de este videos: https://www.youtube.com/watch?v=_fFz-_O2yvI 
para poder descargar correctamente el sqlserver.

Paso 1: Verificar Parámetros de Conexión:

. Asegúrate de que los parámetros de conexión (usuario, contraseña, servidor y nombre de la base de datos) estén correctos.

. Especialmente, revisa los parámetros "user" y "password" que hacen referencia al usuario con el cual se accedió a SQL Server.

.al momento de ingresar al sql server pedira autentificarse por lo que en "authentication" seleccionamos "sql server authentication
 en los Los parámetros "user" ponemos "sa" que seria el usuario y en "password" seria la contraseña puesta cuando se configuraba el sql server en base a eso se pueden modificar en el archivo dbconfig.js el user y el password.

Paso 2: Importar o Ejecutar el Script SQL:

- Dentro del archivo comprimido encontrarás dos archivos:

   . Un archivo .txt para copiar y pegar en SQL Server y ejecutar.
para ello primero abrir un sqcript que aparece en la parte superior del sqlsever luego de ingresar.


Paso 3: Configuración de TCP/IP:

1. Abre SQL Server Configuration Manager.
2. Ve a SQL Server Network Configuration -> Protocols for SQLEXPRESS.
3. Haz clic en "TCP/IP" y en sus propiedades dirígete a IP Addresses.
4. En la última parte, en TCP Dynamic Ports, escribe "1433".

Paso 4: Reiniciar Servicios de SQL Server:

1. Dirígete a SQL Server Services.
2. Selecciona la primera opción, haz clic derecho y selecciona "Restart".
3. Espera a que el servicio se inicie y luego cierra la ventana.

--------------------------------------------------------------------------

*Inicio de la Aplicación*

Paso 5: Abrir Terminal en Visual Studio Code

1. Abre un nuevo terminal en Visual Studio Code.
2. Selecciona la opción "..." en la parte superior y luego "Nuevo Terminal".
3. Si tienes varios proyectos abiertos, selecciona la dirección del archivo donde se guardó la aplicación. Si no, se abrirá automáticamente un terminal.

Paso 6: Iniciar la Aplicación

1. En el terminal, escribe el siguiente comando: "node app.js".

Paso 7: Acceder a la Aplicación

2. Abre tu navegador de preferencia.
3. Accede a la dirección localhost:3000.

NOTA: en el registro de usuario al seleccionar el estado "Docente" el codigo a introducir es "docente123"