require("dotenv").config();
const {createSwapsTable, createBurnsTable, createMintsTable, dropTable} = require("./manageTable");

const Pool = require('pg').Pool;
const pool = new Pool({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port,
});

async function addMint(info){
    query = `
    INSERT INTO mints
    VALUES ('${info['event']}', '${info['pair']}', '${String(info['sender']).slice(2)}',
    '${String(info['owner']).slice(2)}','${info['tickLower']}', '${info['tickUpper']}', 
    '${info['amount']}', '${info['amount0']}', '${info['amount1']}', ${info['blockNumber']});
    `
    pool.query(query)
    .then((results, error) => {
        if (error) {
          return (error);
        } else {
            return (results); 
        }
    });
}

async function addBurn(info){
    query = `
    INSERT INTO burns
    VALUES ('${info['event']}', '${info['pair']}',
    '${String(info['owner']).slice(2)}','${info['tickLower']}', '${info['tickUpper']}', 
    '${info['amount']}', '${info['amount0']}', '${info['amount1']}', ${info['blockNumber']});
    `
    pool.query(query)
    .then((results, error) => {
        if (error) {
          return (error);
        } else {
            return (results); 
        }
    });
}

async function addSwap(info){
    query = `
    INSERT INTO second_swaps
    VALUES ('${info['event']}', '${info['pair']}', '${String(info['sender']).slice(2)}',
    '${String(info['recipient']).slice(2)}','${info['amount0']}', '${info['amount1']}', 
    '${info['sqrtPriceX96']}', '${info['liquidity']}', ${info['tickevent']}, ${info['blockNumber']});
    `
    pool.query(query)
    .then((results, error) => {
        if (error) {
          return (error);
        } else {
            return (results); 
        }
    });
}

async function watchThousand(name){
    let res = await pool.query(`
    SELECT * FROM ${name};
    `)
    return res.rows
}

// async function main(){
//     await watchThousand('second_swaps').then(console.log);
// }
// main()

exports.addSwap = addSwap;
exports.addMint = addMint;
exports.addBurn = addBurn;



