var Pool = require('pg-pool')

configDB = {
  user: "ckpxmqgdcaigzi",
  password: "e1a23b1886fdd5a5e485fbaf100ccf4ff8f4171d8b04d7f08df000fdd7371c07",
  host: "ec2-23-23-92-204.compute-1.amazonaws.com",
  port: "5432",
  database: "d23pekh2fi0ev3",
  ssl: true,
};

/*
configDB = {
  user: 'postgres',
  password: 'docker',
  host: '127.0.0.1',
  port: 5432,
  database: 'postgres',
};*/


const pool = new Pool(configDB);

module.exports = () =>  { return pool }
