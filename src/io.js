const { Server } = require("socket.io") 
const jogadores = [];

module.exports = (httpServer) => {

    const io = new Server(httpServer,{
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PATCH", "DELETE"]
        }
    });

    io.on('connection', (socket) => {

        const novoJogador = {
            id: socket.id, 
            pontuação: 0,
            posição: sortear()
        }
        jogadores.push(novoJogador);
        //socket.broadcast.emit('jogadores', novoJogador);
    
        /*socket.on("change-client", (change) => {

            socket.broadcast.emit('change-server', change);
        })*/
    });

    setInterval(() => {
        io.emit('update',jogadores);
        
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