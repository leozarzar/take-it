
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
    
        data.jogadores.forEach( (jogador) => tabuleiro.adicionarJogador(jogador,socket.id) );
    
        data.pontos.forEach( (ponto) => tabuleiro.adicionarPonto({x: ponto.x, y: ponto.y},ponto.tipo) );
    });
    
    socketRecebe('usuário-adicionado', () => { 

        const jg = tabuleiro.jogadores.find( (jogador) => (jogador.id === socket.id) );
        tabuleiro.selecionarJogadorLocal(jg);

        socketRecebe('update', (data) => { 
        
            countServer++;
            console.log("Server: " + countServer + " " + dir);
            run();
        
            data.forEach((jogador,index) => {
                
                tabuleiro.atualizarJogador(jogador,index);
            });
        
            ordenarLista();
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
    });
    
    socketRecebe('remove-player', (index) => { 
        
        tabuleiro.removerJogador(index);
    });
    
    socketRecebe('point', (data) => { 
        
        pointSound.play();
        tabuleiro.animarPontuação(data.index,data.pontuação);
    });

});

function run(){

    setTimeout(() => {
        
            countClient++;
            console.log("Client: " + countClient + " " + direcional);

            dir = direcional;
            tabuleiro.moverJogador(dir);
            socketEnvia('direcional',dir);
    },90);
}

window.addEventListener('resize', () => {

    tabuleiro.printar();
});