var cluster = require('cluster'); 
const EXPECTED_PONG_BACK = 15000
const KEEP_ALIVE_CHECK_INTERVAL = 7500
const ethers = require("ethers")
const pairABI = require("../abi/PoolV3ABI.json");
const {addMint, addSwap, addBurn} = require("./db/db");
const {safetyEvents} = require("./Safety");
const {events} = require("./Indexer");
const ETH_USDT = "0x11b815efB8f581194ae79006d24E0d814B7697F6"
const ETH_USDC = "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"
const Web3 = require('web3');
const CONTRACT_ADDRESS1 = "0x11b815efB8f581194ae79006d24E0d814B7697F6";
const CONTRACT_ADDRESS2 = "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640";

var CONNECT = false;

async function Safety(START_BLOCK, END_BLOCK){
  // const web3 = new Web3(`wss://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_SOCKET}`);
  const web3 = new Web3(`wss://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_SOCKET}`);
  const contract = new web3.eth.Contract(pairABI,CONTRACT_ADDRESS1);
  console.log(START_BLOCK, END_BLOCK)
  console.log("get contract");    
  safetyEvents(contract, "ETH_USDC",START_BLOCK,END_BLOCK) 

  const contract2 = new web3.eth.Contract(pairABI,CONTRACT_ADDRESS2);
  console.log(START_BLOCK, END_BLOCK)
  console.log("get contract");    
  safetyEvents(contract2, "ETH_USDT",START_BLOCK,END_BLOCK) 
}

function Indexer(provider) {
    const contract = new ethers.Contract(ETH_USDT, pairABI, provider);
    events(contract, "ETH_USDT");
    const contract2 = new ethers.Contract(ETH_USDC, pairABI, provider);
    events(contract2, "ETH_USDC");
}

if (cluster.isMaster) { 
    cluster.schedulingPolicy = cluster.SCHED_NONE;
    cluster.fork();

    var START_BLOCK = 16142771;

    cluster.on('fork', (worker)=>{
        console.log(`Worker# ${worker.id} is online!`)
    })

    cluster.on('message', (worker, msg)=>{
      console.log(`Cluster get message (${msg.start_block}, ${msg.end_block}) from worker #${worker.id}`, )
      try{
        Safety(msg.start_block, msg.end_block)
      } catch(error){
        console.log("error")
      }
    })

    cluster.on('disconnect', (worker)=>{
        console.log(`The worker# ${worker.id} has disconnscted`)
    })

    cluster.on('exit', function(worker, code) { 
        console.log(`Worker ${worker.id} is dead. Exit code ${code}`); 
        worker = cluster.fork();
        START_BLOCK = code
        worker.send({start_block: START_BLOCK})
        });  

} else { 
    var START_BLOCK=16142771;
    var END_BLOCK=16142771;
    process.on('message', (msg)=>{
        console.log("CHILD GET MSG")
        START_BLOCK = msg.start_block
        END_BLOCK = msg.start_block
    })

    console.log(`Worker ${process.pid} started`)
    process.on('uncaughtException', (err) => {
        console.error(`${(new Date).toUTCString()} uncaught exception: ${err.message}`);
        console.error(err.stack);
        CONNECT = false;
        process.exit(END_BLOCK);
    });

    const provider = new ethers.providers.WebSocketProvider(`wss://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_SOCKET}`)
    const logger = new ethers.utils.Logger();
    
    let pingTimeout = null
    let keepAliveInterval = null
    provider._websocket.on('open', () => {
        keepAliveInterval = setInterval(() => {
          logger.debug('Checking if the connection is alive, sending a ping')
          provider._websocket.ping()
          provider.getBlockNumber().then((res,err)=>{
		  if (err){
			  console.log({error: `${err}`})
		  }
		  if (res){
            console.log({blockNumber: res})
            if (!CONNECT){
                CONNECT = true
                END_BLOCK = res
                process.send({end_block: res, start_block: START_BLOCK});
            }
            else{
                START_BLOCK = res    
                END_BLOCK = res
            }
		  }
	  })
      pingTimeout = setTimeout(() => {
        provider._websocket.terminate()
      }, EXPECTED_PONG_BACK)
    }, KEEP_ALIVE_CHECK_INTERVAL)
	  console.log({status: "provider is on" })
        Indexer(provider)
      })

    provider._websocket.on('pong', () => {
      logger.debug('Received pong, so connection is alive, clearing the timeout')
      clearInterval(pingTimeout)
    })    

    provider._websocket.on('close', (err) => {
        logger.warn('The websocket connection was CLOSED')
        clearInterval(keepAliveInterval)
        clearTimeout(pingTimeout)
        console.error(`${(new Date).toUTCString()} uncaught exception: ${err.message}`);
        console.error(err.stack);
        process.exit(END_BLOCK);
      })

    provider._websocket.on('error', (err) => {
        logger.warn('The websocket connection ERROR')
        clearInterval(keepAliveInterval)
        clearTimeout(pingTimeout)
        console.error(`${(new Date).toUTCString()} uncaught exception: ${err.message}`);
        console.error(err.stack);
        process.exit(END_BLOCK);
      })
} 