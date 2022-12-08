const { minutes } = require('@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time/duration');
const Web3 = require('web3');
const CONTRACT_ADDRESS1 = "0x11b815efB8f581194ae79006d24E0d814B7697F6";
const CONTRACT_ADDRESS2 = "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640";
const CONTRACT_ABI = require("../abi/PoolV3ABI.json")
const {addMint, addSwap, addBurn} = require("./db/db");

async function swaps(contract, pair,START_BLOCK,END_BLOCK){
    await contract.getPastEvents("Swap",
        {                               
            fromBlock: START_BLOCK,     
            toBlock: END_BLOCK          
        })                              
    .then(events => {
        events.forEach(async (i)=>{
            v = i.returnValues;
            let info = {
                event: "Swap",
                pair: pair,
                sender: v.sender, 
                recipient: v.recipient, 
                amount0: v.amount0, 
                amount1: v.amount1,  
                sqrtPriceX96: v.sqrtPriceX96,
                liquidity: v.liquidity, 
                tickevent: v.tick, 
                blockNumber: i.blockNumber
            }
            addSwap(info).then(()=>{console.log("Safety Swap")})
        })
    })
    .catch((err) => console.log(`${err}`));   
    return  
} 

async function mints(contract, pair,START_BLOCK,END_BLOCK){
    contract.getPastEvents("Mint",
        {                               
            fromBlock: START_BLOCK,     
            toBlock: END_BLOCK          
        })                              
    .then(events => {
        events.forEach(async (i)=>{
            v = i.returnValues;
            let info = {
                event: "Mint",
                pair: pair,
                sender: v.sender, 
                owner: v.owner, 
                tickLower: v.tickLower, 
                tickUpper: v.tickUpper, 
                amount: v.amount, 
                amount0: v.amount0, 
                amount1: v.amount1, 
                blockNumber: i.blockNumber
            }
            addMint(info).then(console.log("Safety Mint"))
        })
        return
    })
    .catch((err) => console.log(`${err}`));   
    return  
}

async function burns(contract, pair,START_BLOCK,END_BLOCK){
    await contract.getPastEvents("Burn",
        {                               
            fromBlock: START_BLOCK,     
            toBlock: END_BLOCK          
        })                              
    .then(events => {
        events.forEach((i)=>{
            v = i.returnValues;
            let info = {
                event: "Burn",
                pair: pair,
                owner: v.owner, 
                tickLower: v.tickLower, 
                tickUpper: v.tickUpper, 
                amount: v.amount, 
                amount0: v.amount0, 
                amount1: v.amount1,  
                blockNumber: i.blockNumber
            }
            addBurn(info).then(console.log("Safety Burn"))
        })
        return
    })
    .catch((err) => console.log(`${err}`));   
    return  
}

async function safetyEvents(contract, pair,START_BLOCK,END_BLOCK){
    swaps(contract, pair,START_BLOCK,END_BLOCK)
    mints(contract, pair,START_BLOCK,END_BLOCK)
    burns(contract, pair,START_BLOCK,END_BLOCK)
}

// async function Safety(START_BLOCK, END_BLOCK){
//     const web3 = new Web3(`wss://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_SOCKET}`);
//     const contract = new web3.eth.Contract(CONTRACT_ABI,CONTRACT_ADDRESS1);
//     console.log(START_BLOCK, END_BLOCK)
//     console.log("get contract");    
//     safetyEvents(contract, "ETH_USDC",START_BLOCK,END_BLOCK) 
// }

// Safety(16143003 - 5, 16143003)

exports.safetyEvents = safetyEvents; 