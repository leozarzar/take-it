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
    
        console.log(`Cliente conectou! Id: ${socket.id}`);

        clientes.push({id: socket.id, pontuação: 0});
    
        socket.on("change-client", (change) => {

            socket.broadcast.emit('change-server', change);
        })
    });
}