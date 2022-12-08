require('dotenv').config()
const ethers = require("ethers")
const axios = require('axios')

let ClusterMessages = require('cluster-messages');
let messages = new ClusterMessages();

const { TOKEN, SERVER_URL } = process.env
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`
const URI = `/webhook/${TOKEN}`
const WEBHOOK_URL = SERVER_URL + URI
const EXPECTED_PONG_BACK = 15000
const KEEP_ALIVE_CHECK_INTERVAL = 7500

const {Indexer} = require("./Indexer.js");

const init_tg = async () => {
    const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`)
    console.log(res.data)
}

async function Listener(){
    // await init_tg()
    
    // const provider = new ethers.providers.WebSocketProvider(`https://api.etherscan.io/api/apikey=${process.env.API_KEY_ETHERSCAN}`)
    //const provider = new ethers.providers.WebSocketProvider(`wss://mainnet.infura.io/ws/v3/${process.env.INFURA_SOCKET}`)
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
			  process.send({error: `${err}`})
		  }
		  else if (res){
			  process.send({blockNumber: res})
		  }
	  })
      pingTimeout = setTimeout(() => {
        provider._websocket.terminate()
      }, EXPECTED_PONG_BACK)
    }, KEEP_ALIVE_CHECK_INTERVAL)
    
	  process.send({status: "provider is on"})
        Indexer(provider);
      })

    provider._websocket.on('close', () => {
        logger.warn('The websocket connection was closed')
        clearInterval(keepAliveInterval)
        clearTimeout(pingTimeout)
        Listener()
      })

    provider._websocket.on('pong', () => {
        logger.debug('Received pong, so connection is alive, clearing the timeout')
        clearInterval(pingTimeout)
        // console.log("pong")
      })    

}

// async function main(){
  // Listener();
// }

// main().catch((error) => {
    // console.error(error);
    // process.exitCode = 1;
  // });

exports.Listener = Listener;