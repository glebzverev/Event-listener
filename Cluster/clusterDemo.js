const cluster = require('cluster');
const http = require('http');
const { listenerCount } = require('process');
const {Listener} = require("../scripts/Listener")
// const { listenerCount } = require('process');
const port = 6006;

let ClusterMessages = require('cluster-messages');
let messages = new ClusterMessages();


const requestHandler = (request, response) => {

    response.writeHead(200);
    if (request.url === '/error') {
        // uncaught exception
        throw new Error('Oh no!')
    } else {
        response.end(`<h1 style="text-align:center;margin-top:40px;">=^..^=</h1>`);
        // notify master about the request
        process.send({cmd: 'notifyRequest'});
    }
};

const server = http.createServer(requestHandler);

// check is cluster master or not
console.log(`Am I master? ${cluster.isMaster ? `YES` : `NO`}! 
             Am I worker? ${cluster.isWorker ? `YES my id is  ${cluster.worker.id}` : `NO`}!`);

if (cluster.isMaster) {
    cluster.schedulingPolicy = cluster.SCHED_NONE;
    cluster.fork();

    // worker's lifecycle
    cluster.on('fork', (worker) => {
        console.log(`Worker #${worker.id} is online =)`);
    });

    cluster.on('listening', (worker, address) => {
        console.log(
            `The worker #${worker.id} is now connected to ${JSON.stringify(address)}`);
        // Worker is waiting for Master's message
        worker.on('message', messageHandler);
    });

    // messages.on('blockNumber', (data, sendResponse) => {
    //     sendResponse("master response, data block", data);
    //   });

    // cluster.on('blockNumber', (msg) =>{
    //     console.log(`Message from child process`)
    //     console.log(msg)
    // })

    cluster.on('disconnect', (worker) => {
        console.log(`The worker #${worker.id} has disconnected`);
    });

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.id} is dead =(`);
        cluster.fork();
    });
    let numRequests = 0;
    function messageHandler(msg) {
        if (msg.cmd && msg.cmd === 'notifyRequest') {
            numRequests += 1;
            console.log(`Requests received: ${numRequests}`);
        }
    }

} else {
    server.listen(port, (err) => {
        if (err) {
            return console.log(`Server error ${err}`);
        }
        console.log(`Listening port ${port}`);
    });
    // Listener();

    process.on('uncaughtException', (err) => {
        console.error(`${(new Date).toUTCString()} uncaught exception: ${err.message}`);
        console.error(err.stack);
        process.exit(1);
    });
}