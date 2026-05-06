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

      console.log(`     server.js:> Servidor criado. Ouvindo na porta ${port}.`);
    })

    const io = new Server(httpServer,{
      cors: {
          origin: "*",
          methods: ["GET", "POST", "PATCH", "DELETE"]
      }
    });

    io.on('connection', (socket) => {

      console.log(`     server.js:> "${socket.id}" entrou.`);

      // Lobby events
      socket.on('listar-salas', () => {
        notifyAll("listar-salas", { usuário: socket });
      });

      socket.on('criar-sala', (dados) => {
        socket.data.nome = dados.nome;
        notifyAll("criar-sala", { usuário: socket, ...dados });
      });

      socket.on('entrar-sala', (dados) => {
        socket.data.nome = dados.nome;
        notifyAll("entrar-sala", { usuário: socket, ...dados });
      });

      socket.on('pronto', () => {
        notifyAll("pronto", { usuário: socket });
      });

      socket.on('cancelar-pronto', () => {
        notifyAll("cancelar-pronto", { usuário: socket });
      });

      socket.on('sair-sala', () => {
        notifyAll("sair-sala", { usuário: socket });
      });

      // Game events
      socket.on('login-jogador',(dados) => {
        
        notifyAll("novo-jogador",{usuário: socket,...dados});

        socket.on('movimentação',(dados) => {

          notifyAll("nova-movimentação",{usuário: socket,...dados});
        });
      });
    
      socket.on('disconnect',(reason) => {
    
        console.log(`     server.js:> "${socket.id}" saiu.`);

        notifyAll("desconectou",{usuário: socket});
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

    function enviarParaSala(tipo,salaId,dados){

      io.to(salaId).emit(tipo,dados)
    }

    function enviarParaSalaMenos(tipo,salaId,usuário,dados){

      usuário.to(salaId).emit(tipo,dados)
    }

    return {
      enviar: enviar,
      enviarParaTodos: enviarParaTodos,
      enviarParaTodosMenos: enviarParaTodosMenos,
      enviarParaSala: enviarParaSala,
      enviarParaSalaMenos: enviarParaSalaMenos,
    }
}

export default criarServer;
