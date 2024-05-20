const socket = io.connect('http://localhost:3000/');

const socketEnvia = (tipo,enviado) => {

    socket.emit(tipo, enviado);
}

const socketRecebe = (tipo,operação) => {
    
    socket.on(tipo, operação);
}

const socketConecta = (operação) => {
    
    socket.on('connect',operação);
}