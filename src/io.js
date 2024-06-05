const { Server } = require("socket.io") 
const Tabuleiro = require("./classes//Tabuleiro.js");
const contador = {tempo: 0, especial: 5, novoPonto: 0};
const quantidadeDePontos = 3;

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
        if(tipo === "explosivo"){

            io.emit("point",{index: index, pontuação: -50});
        }
        else contador.especial--;
        io.emit("remove-point",index);
        seedPontos();
    }

    const quandoAdicionarJogador = (novoJogador) => {

        io.emit("add-player",novoJogador);
    }

    const quandoRemoverJogador = (index) => {

        io.emit("remove-player",index);
    }
    
    const tabuleiro = new Tabuleiro(quandoAdicionarPonto,quandoRemoverPonto,quandoAdicionarJogador,quandoRemoverJogador);

    const seedPontos = () => {

        setTimeout(() => {
            
            if(tabuleiro.pontos.length < quantidadeDePontos){
                
                if(contador.especial <=0){
                    
                    tabuleiro.adicionarPonto('especial');
                    contador.especial = Math.floor(5 + Math.random() * 6);
                }
                else tabuleiro.adicionarPonto('explosivo');

                seedPontos();
            }
        
        }, Math.floor(1000 + Math.random() * 2000) );
    }

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
                    io.to(socket.id).emit("point",{index: index, pontuação: pontuação});
                    tabuleiro.removerPonto(index);
                }
            });

            io.emit('update',tabuleiro.jogadores);
        });

        socket.on('disconnect',() => {

            tabuleiro.removerJogador(socket.id);
            console.log(`${socket.id} Saiu.`);
        });

        socket.on('direcional',(direcional) => {

            tabuleiro.encontrar(socket.id).atualizarDirecional(direcional);
        });

        socket.on('log',(log) => {

            console.log(log);
        });
    }); 
}