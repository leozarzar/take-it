const express = require('express');
const { Server } = require("socket.io") 
const http = require('http');
var fs = require('fs');

function server(observers){

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

      this.notifyAll("nova-conexão");

      console.log(`> ${socket.id} entrou.`);
    
      socket.emit('setup',{jogadores: tabuleiro.exportarJogadores(), pontos: tabuleiro.exportarPontos()});
    
      socket.on('usuário',(usuário) => {
          
          tabuleiro.adicionarJogador(socket.id,usuário);
          socket.emit('usuário-adicionado');
          
          socket.on('movimentação',(posição) => {
              
              const jogador = tabuleiro.encontrar(socket.id);
    
              jogador.transportar(posição);
    
              tabuleiro.pontos.forEach((ponto,index) => {
    
                  if(ponto.colidiu(jogador)){
    
                      const pontuação = ponto.tipo === "especial" ? 50 : 10;
                      jogador.pontuar(pontuação);
                      socket.emit("my-point",{index: index, pontuação: pontuação});
                      socket.broadcast.emit("someones-point",{id: socket.id, pontuação: pontuação});
                      tabuleiro.removerPonto(index);
                  }
              });
    
              socket.broadcast.emit('update',jogador);
          });
      });
    
    
      socket.on('disconnect',() => {
    
          tabuleiro.removerJogador(socket.id);
          console.log(`${socket.id} Saiu.`);
      });
    
      socket.on('log',(log) => {
    
          console.log(log);
      });
    });

    function notifyAll(comando,data,socket){
    
      for(const observer of observers) observer(comando,data,socket);
    }

    function enviar(tipo,dados,destinatário){
    
      destinatário.emit()
    }

    function enviarParaSocket(tipo,dados,socket){
    
      io.emit
    }

    return {
      io: io,
      enviar: 
    }
}


export default server;

const game = require("./game.js");

game();
