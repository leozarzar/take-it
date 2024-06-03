const { Server } = require("socket.io") 
const Tabuleiro = require("./classes//Tabuleiro.js");
const contador = {tempo: 0, especial: 5, novoPonto: 0};
const quantidadeDePontos = 10;

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

    const quandoAdicionarJogador = (novoJogador) => {

        io.emit("add-player",novoJogador);
    }

    const quandoRemoverJogador = (index) => {

        io.emit("remove-player",index);
    }
    
    const tabuleiro = new Tabuleiro(quandoAdicionarPonto,quandoRemoverPonto,quandoAdicionarJogador,quandoRemoverJogador);

    io.on('connection', (socket) => {

        console.log(`${socket.id} Entrou.`);

        socket.emit('setup',{jogadores: tabuleiro.exportarJogadores(), pontos: tabuleiro.exportarPontos()});

        socket.on('usuário',(usuário) => {
            
            tabuleiro.adicionarJogador(socket.id,usuário);
        });

        socket.on('disconnect',() => {

            console.log(`${socket.id} Saiu.`);

            tabuleiro.removerJogador(socket.id);
        });

        socket.on('direcional',(direcional) => {

            tabuleiro.encontrar(socket.id).atualizarDirecional(direcional);
        });

        socket.on('log',(log) => {

            console.log(log);
        });
    });

    setInterval(() => {

        if(contador.novoPonto !== null && contador.novoPonto > 0) contador.novoPonto--;

        tabuleiro.atualizar();

        tabuleiro.pontos.forEach((ponto) => {

            const jogadores = ponto.colidiu();

            if(jogadores.length > 0){

                tabuleiro.removerPonto(tabuleiro.pontos.indexOf(ponto));

                if(!ponto.especial && contador.especial !== null) contador.especial--;
                if(ponto.especial) contador.especial = Math.ceil(4+Math.random()*6);

                jogadores.forEach( (jogador) => {

                    ponto.tipo === "especial" 
                    ? jogador.pontuar(Math.floor(50/jogadores.length)) 
                    : jogador.pontuar(Math.floor(10/jogadores.length));
    
                    io.to(jogador.id).emit("point-sound",null);
                });
            }
        });

        if(tabuleiro.pontos.length < quantidadeDePontos){

            if(contador.novoPonto === null) contador.novoPonto = Math.floor(5+Math.random()*5);
        }
        else contador.novoPonto = null;

        if(contador.novoPonto === 0 || tabuleiro.pontos.length === 0){

            tabuleiro.adicionarPonto('normal');
            contador.novoPonto = Math.ceil(9+Math.random()*11);
        }

        if(contador.especial === 0){

            tabuleiro.adicionarPonto('especial');
            contador.especial = null;
        }

        io.emit('update',tabuleiro.jogadores);
        
    },100);    
}