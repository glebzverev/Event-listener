require('dotenv').config()
const pairABI = require("../abi/PoolV3ABI.json");
const {addMint, addSwap, addBurn} = require("./db/db");

const ETH_USDT = "0x11b815efB8f581194ae79006d24E0d814B7697F6"
const ETH_USDC = "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"

function events (contract, pair) {
    contract.on("Swap", async (  sender, recipient, amount0, amount1,  sqrtPriceX96,liquidity, tickevent, event) =>{
        let info = {
            event: "Swap",
            pair: pair,
            sender: sender, 
            recipient: recipient, 
            amount0: amount0.toString(), 
            amount1: amount1.toString(),  
            sqrtPriceX96: sqrtPriceX96.toString(),
            liquidity: liquidity.toString(), 
            tickevent: tickevent, 
            blockNumber: event.blockNumber
        }
        await addSwap(info).then(()=>{console.log("Swap")})
    })

    contract.on("Burn", async (  owner, tickLower, tickUpper, amount, amount0, amount1, event) =>{
        let info = {
            event: "Burn",
            pair: pair,
            owner: owner, 
            tickLower: tickLower.toString(), 
            tickUpper: tickUpper.toString(), 
            amount: amount.toString(), 
            amount0: amount0.toString(), 
            amount1: amount1.toString(),  
            blockNumber: event.blockNumber
        }
        await addBurn(info)
    })

    contract.on("Mint", async ( sender, owner, tickLower, tickUpper, amount, amount0, amount1, event ) =>{
        let info = {
            event: "Mint",
            pair: pair,
            sender: sender, 
            owner: owner, 
            tickLower: tickLower.toString(), 
            tickUpper: tickUpper.toString(), 
            amount: amount.toString(), 
            amount0: amount0.toString(), 
            amount1: amount1.toString(), 
            blockNumber: event.blockNumber
        }
        await addMint(info)
    })
}

function Indexer(provider) {
    const contract = new ethers.Contract(ETH_USDT, pairABI, provider);
    events(contract, "ETH_USDT");
    const contract2 = new ethers.Contract(ETH_USDC, pairABI, provider);
    events(contract2, "ETH_USDC");
}
exports.events = events;
exports.Indexer = Indexer;
