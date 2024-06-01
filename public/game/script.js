
const jogadores = [];
const tabuleiro = new Tabuleiro(printarTabuleiro,criarPonto,atualizarPonto);

socketConecta(()=>{

    socketEnvia('usuário',localStorage.getItem('usuário'));
});

socketRecebe('update', (data) => { 

    data.toRemove.forEach((index)=>{

        jogadores[index].eliminar();
        jogadores.splice(index,1);
    })
    
    data.toAdd.forEach((novoJogador)=>{

        jogadores.push(new Jogador(novoJogador.id, novoJogador.usuário, novoJogador.id === socket.id ? true : false));
    })

    data.jogadores.forEach((jogador,index) => {
        
        jogadores[index].mover(jogador.posição);
        jogadores[index].atualizarPontuação(jogador.pontuação);
    });
        
    while( ( tabuleiro.pontos.length - data.pontos.length ) > 0 ) tabuleiro.removerPonto(0);

    data.pontos.forEach((ponto,index) => {

        if( (index + 1) > tabuleiro.pontos.length ) tabuleiro.adicionarPonto(ponto);
        else tabuleiro.atualizarPonto(index,ponto);
    });
})

socketRecebe('point', () => { 
    
    pointSound.play();
});

socketRecebe('update-score', () => { 
    
    ordenarLista();
});

window.addEventListener('resize', () => {

    tabuleiro.printar();
})