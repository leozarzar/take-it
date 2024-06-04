
const tabuleiro = new Tabuleiro(printarTabuleiro,atualizarPonto,atualizarJogador,atualizarPontuação,criarPonto,criarJogador,criarPlacar,criarAnimaçãoPonto);

socketConecta(()=>{

    socketEnvia('usuário',localStorage.getItem('usuário'));
});

socketRecebe('setup', (data) => { 

    data.jogadores.forEach( (jogador) => tabuleiro.adicionarJogador(jogador,socket.id) );

    data.pontos.forEach( (ponto) => tabuleiro.adicionarPonto({x: ponto.x, y: ponto.y},ponto.tipo) );
})

socketRecebe('update', (data) => { 

    console.log(data)
    console.log(tabuleiro.jogadores)

    data.forEach((jogador,index) => {
        
        tabuleiro.atualizarJogador(jogador,index);
    });

    ordenarLista();
})

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

window.addEventListener('resize', () => {

    tabuleiro.printar();
})