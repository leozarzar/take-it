import Game from './Game.js';

class Network{

    constructor(io){

        this.io = io;
        this.observers = [];

        this.io.on('connection', (socket) => {

            console.log(`     server.js:> "${socket.id}" entrou.`);

            let game = new Game({ observers: [this] });
            this.observers.push(game);

            socket.onAny((eventName,data) => this.newEvent(eventName,{...data, id: socket.id}));

            socket.on('disconnect', () => {

                this.observers.pop();
                this.newEvent('desconectou',{ id: socket.id });
            });
        });

    }

    newEvent(event,data){
        this.observers.forEach((observer) => observer.handle(event,data));
    }

    handle(event,data){
        const { to, except, end } = data;
        if(to) this.io.to(to).emit(event,data);
        else if(except) this.io.sockets.sockets.get(except).broadcast.emit(event,data);
        else if(end){
            this.io.emit(event,data);
            this.io.sockets.sockets.get(end).disconnect(true);
        }
        else this.io.emit(event,data);
    }
}

export default Network;