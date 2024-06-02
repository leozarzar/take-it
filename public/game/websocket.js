const socket = io.connect(window.location.origin);
const module = {exports: null};

const socketEnvia = (tipo,enviado) => {

    socket.emit(tipo, enviado);
}

const socketRecebe = (tipo,operação) => {
    
    socket.on(tipo, operação);
}

const socketConecta = (operação) => {
    
    socket.on('connect',operação);
}

const require = (tipo) => {

    return null;
}