import express from 'express';
import { Server } from "socket.io";
import http from "http";
import fs from "fs";
import Network from './Network.js';

const app = express();
const port = 3000;

app.use(express.static( 'public' ));

app.get( "/demo", ( req, res ) => {

  res.status(200).send(JSON.parse(fs.readFileSync('./src/demo/states.json')));
});

const httpServer = http.createServer(app);

httpServer.listen(port, () => {

  console.log(`     server.js:> Servidor criado. Ouvindo na porta ${port}.`);
})

const io = new Server(httpServer,{
  cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH", "DELETE"]
  }
});

new Network(io);

