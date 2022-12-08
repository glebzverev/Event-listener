const cluster = require("cluster");
const http = require("http");
// const { Server } = require("socket.io");
// const { io } = require("socket.io-client");
// const numCPUs = require("os").cpus().length;
const { setupMaster, setupWorker } = require("@socket.io/sticky");
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");
const ethers = require("ethers")
require("dotenv")

const {Indexer} = require("../scripts/Indexer.js");
const { Listener } = require("../scripts/Listener.js");


const { TOKEN, SERVER_URL } = process.env
const URI = `/webhook/${TOKEN}`
const EXPECTED_PONG_BACK = 15000
const KEEP_ALIVE_CHECK_INTERVAL = 7500


if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
//   const httpServer = http.createServer();

  // setup sticky sessions
//   setupMaster(httpServer, {
//     loadBalancingMethod: "least-connection",
//   });

  // setup connections between the workers
    setupPrimary();

  // needed for packets containing buffers (you can ignore it if you only send plaintext objects)
  cluster.setupMaster({
    serialization: "advanced",
  });

  cluster.setupPrimary({
    serialization: "advanced",
  });

  cluster.fork();

  cluster.on("message", (req) =>{
    console.log(req)
  })

  cluster.on("error", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
  cluster.fork();
  });

} else {
    console.log(`Worker ${process.pid} started`);
    Listener()
}