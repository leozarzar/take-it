
const jogadores = [];

printarTabuleiro();

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

    ponto.mover(data.ponto);

    /*if(jogadores.length > 0 && gravar) dados.push({
        jogador: {x: jogadores[0].x, y: jogadores[0].y},
        ponto: data.ponto
    });*/
})

socketRecebe('point', () => { 
    
    pointSound.play();
});

socketRecebe('update-score', () => { 
    
    ordenarLista();
});

window.addEventListener('resize', () => {

    printarTabuleiro();
})