require("dotenv").config();

const Pool = require('pg').Pool;
const pool = new Pool({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port,
});

async function createMintsTable(){
    pool.query(`CREATE TABLE IF NOT EXISTS mints  (
        "event" varchar(40) NOT NULL,
        "pair" varchar(40) NOT NULL,
        "sender" varchar(40) NOT NULL,
        "owner" varchar(40) NOT NULL,
        "tickLower" varchar(40) NOT NULL,
        "tickUpper" varchar(40) NOT NULL,
        "amount" varchar(40) NOT NULL,
        "amount0" varchar(40) NOT NULL,
        "amount1" varchar(40) NOT NULL,
        "blockNumber" INT NOT NULL
    );`).then((results, error) => {
        if (error) {
          console.log(error);
        } else {
        console.log(results);
        }
    });
}

async function createBurnsTable(){
  pool.query(`CREATE TABLE IF NOT EXISTS burns  (
      "event" varchar(40) NOT NULL,
      "pair" varchar(40) NOT NULL,
      "owner" varchar(40) NOT NULL,
      "tickLower" varchar(40) NOT NULL,
      "tickUpper" varchar(40) NOT NULL,
      "amount" varchar(40) NOT NULL,
      "amount0" varchar(40) NOT NULL,
      "amount1" varchar(40) NOT NULL,
      "blockNumber" INT NOT NULL
  );`).then((results, error) => {
      if (error) {
        console.log(error);
      } else {
      console.log(results);
      }
  });
}

async function createSwapsTable(){
  pool.query(`CREATE TABLE IF NOT EXISTS second_swaps  (
      "event" varchar(40) NOT NULL,
      "pair" varchar(40) NOT NULL,
      "sender" varchar(40) NOT NULL,
      "recepient" varchar(40) NOT NULL,
      "amount0" varchar(40) NOT NULL,
      "amount1" varchar(40) NOT NULL,
      "sqrtPriceX96" varchar(40) NOT NULL,
      "liquidity" varchar(40) NOT NULL,
      "tickevent" INT NOT NULL,
      "blockNumber" INT NOT NULL
  );`).then((results, error) => {
      if (error) {
        console.log(error);
      } else {
      console.log(results);
      }
  });
}

async function dropTable(name){
  pool.query(`DROP TABLE IF EXISTS ${name};`).then((results, error) => {
      if (error) {
        console.log(error);
      } else {
      console.log(results.command);
      }
  });
}

exports.createSwapsTable = createSwapsTable;
exports.createBurnsTable = createBurnsTable;
exports.createMintsTable = createMintsTable;
exports.dropTable = dropTable;
