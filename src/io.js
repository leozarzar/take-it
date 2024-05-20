const { Server } = require("socket.io") 
const clientes = [];

module.exports = (httpServer) => {

    const io = new Server(httpServer,{
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PATCH", "DELETE"]
        }
    });

    io.on('connection', (socket) => {
    
        //console.log(`Cliente conectou! Id: ${socket.id}`);

        const novoJogador = {id: socket.id, pontuação: 0};
        clientes.push(novoJogador);
        socket.broadcast.emit('jogadores', novoJogador);
    
        socket.on("change-client", (change) => {

            socket.broadcast.emit('change-server', change);
        })
    });
}