const express = require('express');
const { Server } = require("socket.io") 
const http = require('http');
var fs = require('fs');

const app = express();
const port = 3000;

app.use(express.static( 'public' ));

app.get( "/demo", ( req, res ) => {

  res.status(200).send(JSON.parse(fs.readFileSync('./src/demo/states.json')));
});

const httpServer = http.createServer(app);

httpServer.listen(port, () => {

    console.log(`Ouvindo na porta ${port}.`);
})

module.exports = new Server(httpServer,{
  cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH", "DELETE"]
  }
});

const game = require("./game.js");

game();