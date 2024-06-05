
const tabuleiro = new Tabuleiro(printarTabuleiro,atualizarPonto,atualizarJogador,atualizarPontuação,criarPonto,criarJogador,criarPlacar,criarAnimaçãoPonto);

let setup = false;
let running = false;
let jogador;

let dir;

let countClient = 0;

let countServer = 0;

socketConecta(()=>{

    socketEnvia('usuário',localStorage.getItem('usuário'));

    socketRecebe('setup', (data) => { 

        console.log("Setup Feito:");
        console.log(data);
    
        data.jogadores.forEach( (jogador) => tabuleiro.adicionarJogador({id:jogador.id,usuário: jogador.usuário,posição:{x: jogador.x,y: jogador.y}},socket.id) );
    
        data.pontos.forEach( (ponto) => tabuleiro.adicionarPonto({x: ponto.x, y: ponto.y},ponto.tipo) );
    });
    
    socketRecebe('usuário-adicionado', () => { 

        console.log("Eu Fui Adicionado:");
        console.log(tabuleiro.jogadores);
        tabuleiro.selecionarJogadorLocal(tabuleiro.jogadores.find( (jogador) => (jogador.id === socket.id) ));

        setInterval(() => {

            if(direcional !== ""){

                tabuleiro.moverJogador(direcional);
                socketEnvia('movimentação',{x: tabuleiro.jogadorLocal.x, y: tabuleiro.jogadorLocal.y});
            }
        },100);

        socketRecebe('update', (jogador) => { 
                
            tabuleiro.atualizarJogador(jogador);
        })
    });

    socketRecebe('add-point', (novoPonto) => { 
    
        tabuleiro.adicionarPonto({x: novoPonto.x, y: novoPonto.y},novoPonto.tipo);
    });
    
    socketRecebe('remove-point', (index) => { 
        
        tabuleiro.removerPonto(index);
    });
    
    socketRecebe('add-player', (novoJogador) => { 
        
        tabuleiro.adicionarJogador(novoJogador,socket.id);
        console.log("Usuário Adicionado:");
        console.log(tabuleiro.jogadores);
    });
    
    socketRecebe('remove-player', (index) => { 
        
        console.log("Usuário Removido:");
        console.log(tabuleiro.jogadores);
        console.log(index);
        tabuleiro.removerJogador(index);
    });
    
    socketRecebe('my-point', (data) => { 
        
        pointSound.play();
        tabuleiro.animarPontuação(data.index,data.pontuação);
        tabuleiro.jogadorLocal.atualizarPontuação(tabuleiro.jogadorLocal.pontuação+data.pontuação);
        ordenarLista();
    });

    socketRecebe('someones-point', (data) => { 
        
        tabuleiro.encontrar(data.id).atualizarPontuação(tabuleiro.jogadorLocal.pontuação+data.pontuação);
        ordenarLista();
    });

    socketRecebe('everyones-point', (data) => { 
        
        tabuleiro.animarPontuação(data.index,data.pontuação);
        tabuleiro.jogadores.forEach( (jogador) => {jogador.atualizarPontuação(jogador.pontuação+data.pontuação)} );
    });

});

window.addEventListener('resize', () => {

    tabuleiro.printar();
});