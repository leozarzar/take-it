const { Server } = require("socket.io") 
const jogadores = [];
const toRemove = [];
let ponto = {x: Math.ceil(Math.random()*20),y: Math.ceil(Math.random()*20)};

module.exports = (httpServer) => {

    const io = new Server(httpServer,{
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PATCH", "DELETE"]
        }
    });

    io.on('connection', (socket) => {

        socket.on('disconnect',(reason) => {

            if(jogadores.find(jogador => jogador.id === socket.id) !== undefined){

                toRemove.push(jogadores.find(jogador => jogador.id === socket.id));
                jogadores.splice(jogadores.indexOf(jogadores.find(jogador => jogador.id === socket.id)),1);
            }
        });

        socket.on('direcional',(direcional) => {
            jogadores.find((jogador)=>{
                if(jogador.id === socket.id){
                    jogador.direcional = direcional;
                    return true;
                }
            })
        });

        if(jogadores.find(jogador => jogador.id === socket.id) === undefined){

            const novoJogador = {
                id: socket.id, 
                pontuação: 0,
                posição: sortear(),
                direcional: ""
            }
            jogadores.push(novoJogador);
        }
    });

    setInterval(() => {

        let change = false;
        jogadores.forEach((jogador) => {

            switch(jogador.direcional){
                case '':
                break;
                case 'ArrowLeft':
                jogador.posição.x--;
                break;
                case 'ArrowRight':
                jogador.posição.x++;
                break;
                case 'ArrowUp':
                jogador.posição.y--;
                break;
                case 'ArrowDown':
                jogador.posição.y++;
                break;
            }
            if(jogador.posição.x === ponto.x && jogador.posição.y === ponto.y){

                jogador.pontuação = jogador.pontuação+10;
                change = true;
            }
        });
        if(change) ponto = sortear();
        io.emit('update',{
            jogadores: jogadores,
            toRemove: toRemove,
            ponto: ponto
        });
        toRemove.length = 0;
    },80);    
}

const sortear = () => {

    let x,y;

    x = Math.ceil(Math.random()*20);
    y = Math.ceil(Math.random()*20);

    if(jogadores.find((jogador) => {

        if(jogador.posição.x === x && jogador.posição.y === y) return true;
    }) !== undefined){

        return sortear();
    }
    else return {
        x: x,
        y: y
    } 
}