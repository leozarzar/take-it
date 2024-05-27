const { Server } = require("socket.io") 
const jogadores = [];
const toRemove = [];
const toAdd = [];
let ponto = {x: Math.ceil(Math.random()*20),y: Math.ceil(Math.random()*20)};

module.exports = (httpServer) => {

    const io = new Server(httpServer,{
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PATCH", "DELETE"]
        }
    });

    io.on('connection', (socket) => {

        socket.emit('update',{
            jogadores: jogadores,
            toRemove: toRemove,
            toAdd: jogadores,
            ponto: ponto
        });

        socket.on('disconnect',(reason) => {

            const index = jogadores.findIndex(jogador => jogador.id === socket.id);
            toRemove.push(index);
            jogadores.splice(index,1);
        });

        socket.on('log',(log) => {

            console.log(log);
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
            toAdd.push(novoJogador);
        }
    });

    setInterval(() => {

        let change = false;
        jogadores.forEach((jogador) => {

            switch(jogador.direcional){
                case '':
                break;
                case 'ArrowLeft':
                    if(jogador.posição.x > 1) jogador.posição.x--;
                break;
                case 'ArrowRight':
                    if(jogador.posição.x < 20) jogador.posição.x++;
                break;
                case 'ArrowUp':
                    if(jogador.posição.y > 1) jogador.posição.y--;
                break;
                case 'ArrowDown':
                    if(jogador.posição.y < 20) jogador.posição.y++;
                break;
            }
            if(jogador.posição.x === ponto.x && jogador.posição.y === ponto.y){

                jogador.pontuação = jogador.pontuação+10;
                change = true;
                io.to(jogador.id).emit("point",null);
            }
        });
        if(change) ponto = sortear();
        io.emit('update',{
            jogadores: jogadores,
            toRemove: toRemove,
            toAdd: toAdd,
            ponto: ponto
        });
        toRemove.length = 0;
        toAdd.length = 0;
        io.emit("update-score",null);
    },100);    
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