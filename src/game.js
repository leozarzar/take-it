const io = require("./server.js") 
const Tabuleiro = require("./classes/Tabuleiro.js");
const contador = {tempo: 0, especial: 5, novoPonto: 0, bomba: 10};
const quantidadeDePontos = 6;

function game(){
    
    const tabuleiro = new Tabuleiro(quandoAdicionarPonto,quandoRemoverPonto,quandoAdicionarJogador,quandoRemoverJogador);

    seedPontos();

    io.on('connection', (socket) => {

        console.log(`${socket.id} Entrou.`);

        socket.emit('setup',{jogadores: tabuleiro.exportarJogadores(), pontos: tabuleiro.exportarPontos()});

        socket.on('usuário',(usuário) => {
            
            tabuleiro.adicionarJogador(socket.id,usuário);
            socket.emit('usuário-adicionado');
        });

        socket.on('movimentação',(posição) => {
            
            const jogador = tabuleiro.encontrar(socket.id);

            jogador.transportar(posição);

            tabuleiro.pontos.forEach((ponto,index) => {

                if(ponto.colidiu(jogador)){

                    const pontuação = ponto.tipo === "especial" ? 50 : 10;
                    jogador.pontuar(pontuação);
                    socket.emit("my-point",{index: index, pontuação: pontuação});
                    socket.broadcast.emit("someones-point",{id: socket.id, pontuação: pontuação});
                    tabuleiro.removerPonto(index);
                }
            });

            socket.broadcast.emit('update',jogador);
        });

        socket.on('disconnect',() => {

            tabuleiro.removerJogador(socket.id);
            console.log(`${socket.id} Saiu.`);
        });

        socket.on('log',(log) => {

            console.log(log);
        });
    });

    function quandoAdicionarPonto(novoPonto){

        io.emit("add-point",novoPonto);
    }
    
    function quandoRemoverPonto(index,tipo,timeout){
    
        if(tipo === "especial") contador.especial = Math.ceil(4+Math.random()*6);
        if(tipo === "explosivo"){

            if(timeout){

                tabuleiro.jogadores.forEach( (jogador) => {jogador.pontuar(-50)} );
                io.emit("everyones-point",{index: index, pontuação: -50});
            }
            contador.bomba = Math.ceil(9+Math.random()*6);
        }
        else{
            contador.especial--;
            contador.bomba--;
        }
        io.emit("remove-point",index);
        seedPontos();
    }

    function quandoAdicionarJogador(novoJogador){

        io.emit("add-player",novoJogador);
    }

    function quandoRemoverJogador(index){

        io.emit("remove-player",index);
    }

    function seedPontos(){

        setTimeout(() => {
            
            if(tabuleiro.pontos.length < quantidadeDePontos){
                
                if(contador.especial <=0){
                    
                    tabuleiro.adicionarPonto('especial');
                    contador.especial = 1000000;
                }
                else if(contador.bomba <=0){
                    
                    tabuleiro.adicionarPonto('explosivo');
                    contador.bomba = 1000000;
                }
                else tabuleiro.adicionarPonto('normal');

                seedPontos();
            }
        
        }, Math.floor(1000 + Math.random() * 2000) );
    }
}

module.exports = game;