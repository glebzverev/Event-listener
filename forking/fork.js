const { fork } = require('child_process');
const cluster = require('cluster');


LAST_BLOCK = 0;
LISTENER = true;

socket = fork('scripts/Listener.js');
socket.on('message', (msg)=>{
  if (msg.blockNumber)
    LAST_BLOCK = msg.blockNumber
  console.log(`Last register block ${LAST_BLOCK}`)
})

server = fork('Server.js');
server.on('message', (msg)=>{
  console.log(`messgae from server: ${msg}`)
  if (msg.start && !LISTENER){
    socket = fork('scripts/Listener.js');
    LISTENER = true;
  }

  if (msg.stop && LISTENER){
    LISTENER = false
    socket.exit(1);
  }
})


