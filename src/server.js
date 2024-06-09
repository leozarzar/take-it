import express from 'express';
import { Server } from "socket.io";
import http from "http";
import fs from "fs";

function criarServer(observers){

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

    const io = new Server(httpServer,{
      cors: {
          origin: "*",
          methods: ["GET", "POST", "PATCH", "DELETE"]
      }
    });

    io.on('connection', (socket) => {

      console.log(`> ${socket.id} entrou.`);

      notifyAll("conectou",{usuário: socket});

      socket.on('usuário',(dados) => {
          
          notifyAll("recebeu-dados-do-usuário",{usuário: socket,...dados});
          
          socket.on('movimentação',(dados) => {

            notifyAll("nova-movimentação",{usuário: socket,...dados});
          });
      });
    
      socket.on('disconnect',() => {
    
          notifyAll("desconectou",{usuário: socket});

          console.log(`${socket.id} Saiu.`);
      });
    
      socket.on('log',(log) => {
    
          console.log(log);
      });
    });

    function notifyAll(comando,data,socket){
    
      for(const observer of observers) observer(comando,data,socket);
    }

    function enviar(tipo,usuário,dados){
    
      usuário.emit(tipo,dados)
    }

    function enviarParaTodos(tipo,dados){
    
      io.emit(tipo,dados)
    }

    function enviarParaTodosMenos(tipo,usuário,dados){
    
      usuário.broadcast.emit(tipo,dados)
    }

    return {
      enviar: enviar,
      enviarParaTodos: enviarParaTodos,
      enviarParaTodosMenos: enviarParaTodosMenos
    }
}

export default criarServer;
