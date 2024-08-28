// dbConfig.js
const mysql = require('mysql');

// Configuración de la conexión

const connection = mysql.createConnection({
    host: 'b2zvutfvurarprltu3dn-mysql.services.clever-cloud.com',
    user: 'ueaomjbmtjkdkrie',
    password: 'wMiKJHJ28CoVfdk9pq9P',
    database: 'b2zvutfvurarprltu3dn',
    port: 3306
  });
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err.stack);
      return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
  });
