// const { ethers } = require('ethers');

const Web3 = require('web3');
// const ethers = require(ethers) 

// const client = require('node-rest-client-promise').Client();

// const INFURA_KEY = "SECRET_INFURA_KEY"; // Insert your own key here :)
// const CONTRACT_ADDRESS = "0x11b815efB8f581194ae79006d24E0d814B7697F6"
// const ETHERSCAN_API_KEY = process.env.API_KEY_ETHERSCAN;

const web3 = new Web3(`wss://mainnet.infura.io/ws/v3/${process.env.INFURA_SOCKET}`);
const CONTRACT_ADDRESS = "0x11b815efB8f581194ae79006d24E0d814B7697F6";

const CONTRACT_ABI = require("./abi/PoolV3ABI.json")

async function eventQuery(){
    const contract = new web3.eth.Contract(CONTRACT_ABI,CONTRACT_ADDRESS);
    /*    Code to query events here       */
    console.log("get contract");    
    const START_BLOCK = 16135237-2;
    const END_BLOCK = 16135237;
    contract.getPastEvents("Swap",
        {                               
            fromBlock: START_BLOCK,     
            toBlock: END_BLOCK          
        })                              
    .then(events => console.log(events))
    .catch((err) => console.error(err));
        // contract.close()
}

eventQuery()