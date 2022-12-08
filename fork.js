const express = require("express");
const { fork } = require('child_process');

// const forked = fork('scripts/Listener.js');
const app = express();

//forked.on('message', (msg) => {
  //console.log('Message from child', msg);
//});

LAST_BLOCK = 0;

app.get("/start", function (request, response) {
    response.end(`<h1 style="text-align":center; margin-top:40px;">=^..^=</h1>`);
    forked = fork('scripts/Listener.js');
    forked.on('message', (msg)=>{
	console.log("Message from child", msg)
    	if (msg.blockNumber)
	    LAST_BLOCK = msg.blockNumber
    })
    
    forked.send({ hello: 'world' });

app.get("/stop", (requset, response) => {
	response.send(`<h1 style="text-align":center; margin-top:40px;">Stop socket. Last block number: ${LAST_BLOCK}</h1>`)
})
});
app.listen(3000, ()=> console.log("Master is up"))
