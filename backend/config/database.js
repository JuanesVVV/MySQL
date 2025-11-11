const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'cybershield_db'
});
connection.connect(err => {
  if (err) throw err;
  console.log('Conectado a CyberShield DB');
});
module.exports = connection;