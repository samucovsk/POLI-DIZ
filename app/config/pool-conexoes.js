console.log('Tentando conectar ao banco de dados...');
const mysql = require('mysql2');
require('dotenv').config();;


const pool = mysql.createPool({
    host: 'bvndgtfduizlneklbnzh-mysql.services.clever-cloud.com',
    user: 'uqpbzncni5ppwzxc',
    password: 'cmDXANeTHk4QsMgSBT53',
    database: 'bvndgtfduizlneklbnzh',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, conn) => {
    if(err) 
        console.log(err)
    else
        console.log("Conectado ao SGBD!")
})

module.exports = pool.promise()
