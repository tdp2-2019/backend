var Pool = require('pg-pool')
/*
configDB = {
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  database: process.env.DBNAME,
  ssl: true,
};
*/
configDB = {
  user: 'postgres',
  password: 'docker',
  host: '127.0.0.1',
  port: 5432,
  database: 'postgres',
};


const pool = new Pool(configDB);

module.exports = () =>  { return pool }
