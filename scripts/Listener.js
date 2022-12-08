require('dotenv').config()
const ethers = require("ethers")
const EXPECTED_PONG_BACK = 15000
const KEEP_ALIVE_CHECK_INTERVAL = 7500

const {Indexer} = require("./Indexer.js");


async function Listener(){
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
		  else if (res){
			  console.log({blockNumber: res})
		  }
	  })
      pingTimeout = setTimeout(() => {
        provider._websocket.terminate()
      }, EXPECTED_PONG_BACK)
    }, KEEP_ALIVE_CHECK_INTERVAL)
	  console.log({status: "provider is on", })
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
        process.exit(1);
      })

    provider._websocket.on('error', (err) => {
        logger.warn('The websocket connection ERROR')
        clearInterval(keepAliveInterval)
        clearTimeout(pingTimeout)
        console.error(`${(new Date).toUTCString()} uncaught exception: ${err.message}`);
        console.error(err.stack);
        process.exit(1);
      })
}

// async function main(){
  // Listener();
// }

Listener().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

exports.Listener = Listener;