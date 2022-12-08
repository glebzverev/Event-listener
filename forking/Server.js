const express = require("express")

const app = express()

app.get("/start", function (request, response) {
    response.end(`<h1 style="text-align":center; margin-top:40px;">=^..^=</h1>`);
    process.send({start: true});
  });

app.get("/stop", function (request, response) {
    response.end(`<h1 style="text-align":center; margin-top:40px;">STOP</h1>`);
    process.send({stop: true})
  });

app.listen(80, ()=> console.log("Socket child is up"))
