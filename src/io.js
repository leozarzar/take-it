const { Server } = require("socket.io") 
const jogadores = [];
const toRemove = [];
const toAdd = [];
const contador = {tempo: 0, especial: 5, novoPonto: 0};
const Tabuleiro = require("./classes//Tabuleiro.js");

module.exports = (httpServer) => {

    const io = new Server(httpServer,{
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PATCH", "DELETE"]
        }
    });

    const quandoAdicionarPonto = (novoPonto) => {

        io.emit("add-point",novoPonto);
    }
    
    const quandoRemoverPonto = (index,tipo) => {
    
        if(tipo === "especial") contador.especial = Math.ceil(4+Math.random()*6);
        io.emit("remove-point",index);
    }
    
    const tabuleiro = new Tabuleiro(quandoAdicionarPonto,quandoRemoverPonto);

    io.on('connection', (socket) => {

        console.log(`${socket.id} Entrou.`);

        socket.emit('update',{
            jogadores: jogadores,
            toRemove: toRemove,
            toAdd: jogadores
        });

        tabuleiro.pontos.forEach((ponto) => {

            socket.emit("add-point",{x: ponto.x ,y: ponto.y ,tipo: ponto.tipo});
        });

        socket.on('disconnect',(reason) => {

            console.log(`${socket.id} Saiu.`);
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

        socket.on('usuário',(usuário) => {
            
            if(jogadores.find(jogador => jogador.id === socket.id) === undefined){

                const novoJogador = {
                    id: socket.id, 
                    usuário: usuário,
                    pontuação: 0,
                    posição: sortear(),
                    direcional: ""
                }
                jogadores.push(novoJogador);
                toAdd.push(novoJogador);
            }
        });
    });

    setInterval(() => {

        /*pontos.forEach((ponto,index) => {
            
            if(ponto.intervalo()){

                pontos.splice(index,1);
                contador.especial = Math.ceil(4+Math.random()*6);
            }
        });*/

        if(contador.novoPonto !== null && contador.novoPonto > 0) contador.novoPonto--;

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
            tabuleiro.pontos.forEach((ponto,index)=>{

                if(jogador.posição.x === ponto.x && jogador.posição.y === ponto.y){
    
                    jogador.pontuação = ponto.tipo === "especial" ? jogador.pontuação+50 : jogador.pontuação+10;

                    tabuleiro.removerPonto(index);

                    if(!ponto.especial && contador.especial !== null) contador.especial--;
                    if(ponto.especial) contador.especial = Math.ceil(4+Math.random()*6);

                    io.to(jogador.id).emit("point-sound",null);
                }
            });
        });

        if(tabuleiro.pontos.length < 3){

            if(contador.novoPonto === null) contador.novoPonto = Math.floor(5+Math.random()*5);
        }
        else contador.novoPonto = null;

        if(contador.novoPonto === 0 || tabuleiro.pontos.length === 0){

            tabuleiro.adicionarPonto({...sortear()},'normal');
            contador.novoPonto = Math.ceil(9+Math.random()*11);
        }

        if(contador.especial === 0){

            tabuleiro.adicionarPonto({...sortear()},'especial');
            contador.especial = null;
        }

        io.emit('update',{
            jogadores: jogadores,
            toRemove: toRemove,
            toAdd: toAdd,
            pontos: tabuleiro.pontos
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