const mysql = require('mysql2');
require('dotenv').config();
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);

const connection = mysql.createConnection({
    host: 'bvndgtfduizlneklbnzh-mysql.services.clever-cloud.com',
    user: 'uqpbzncni5ppwzxc',
    password: 'cmDXANeTHk4QsMgSBT53',
    database: 'bvndgtfduizlneklbnzh',
    port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL.');
});

module.exports = connection;
