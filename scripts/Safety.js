// const { ContractFunctionVisibility } = require('hardhat/internal/hardhat-network/stack-traces/model');
const Web3 = require('web3');
const web3 = new Web3(`wss://mainnet.infura.io/ws/v3/${process.env.INFURA_SOCKET}`);
const CONTRACT_ADDRESS = "0x11b815efB8f581194ae79006d24E0d814B7697F6";
const CONTRACT_ABI = require("../abi/PoolV3ABI.json")
const contract = new web3.eth.Contract(CONTRACT_ABI,CONTRACT_ADDRESS);

async function eventQuery(START_BLOCK, END_BLOCK){
    /*    Code to query events here       */
    console.log(START_BLOCK, END_BLOCK)
    console.log("get contract");    
    await contract.getPastEvents("Swap",
        {                               
            fromBlock: START_BLOCK,     
            toBlock: END_BLOCK          
        })                              
    .then(events => {
        console.log(events)
        return
    })
    .catch((err) => console.log(`error: ${err}`));   
    return  
}

for(var i =0; i<10; i++){
    eventQuery(16135237+i*10, 16135237+(i+1)*10)
}

exports.eventQuery = eventQuery; 