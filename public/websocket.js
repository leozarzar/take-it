const socket = io.connect('http://localhost:3000/');

const socketEnvia = (tipo,enviado) => {

    socket.emit(`${tipo}-client`, enviado);
}

const socketRecebe = (tipo,operação) => {
    
    socket.on(`${tipo}-server`, operação);
}