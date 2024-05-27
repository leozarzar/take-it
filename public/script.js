const tabuleiro = document.querySelector(".tabuleiro");
const placarGeral = document.querySelector(".placar-geral");
const modeloPlacar = document.querySelector(".placar");
const modeloCursor = document.querySelector(".cursor");
const modeloPonto = document.querySelector(".ponto");

const pointSound = new Audio("/public/point.mp3");

const jogadores = [];

const ponto = new Ponto(modeloPonto.cloneNode(true));
tabuleiro.appendChild(ponto.element);

socketRecebe('update', (data) => { 

    data.toRemove.forEach((index)=>{

        jogadores[index].eliminar();
        jogadores.splice(index,1);
    })

    data.toAdd.forEach((novoJogador)=>{

        jogadores.push(new Jogador(novoJogador.id, novoJogador.id === socket.id ? true : false));
    })

    data.jogadores.forEach((jogador,index) => {
        
        jogadores[index].mover(jogador.posição);
        jogadores[index].atualizarPontuação(jogador.pontuação);
    });

    ponto.mover(data.ponto.x,data.ponto.y);
})

function ordenarLista(){

    jogadores
    .map((jogador)=>[jogador.pontuação,jogador.id])
    .sort((a,b)=>b[0]-a[0])
    .forEach((element)=>{
        const child = placarGeral.querySelector(`.placar${element[1]}`);
        placarGeral.appendChild(child);
    });
} 

socketRecebe('point', () => { 

    pointSound.play();
});

socketRecebe('update-score', () => { 

    ordenarLista();
});

    /*socketConecta(() => {
    
        const cursor = new Cursor(modeloCursor.cloneNode(true),2,2,socket.id);
        tabuleiro.appendChild(cursor.element);
        const jogador = {id: socket.id, pontuação: 0,cursor: cursor};
        jogadores.push(jogador);
    
        modeloJogador.classList.add(`jogador${socket.id}`);
        modeloJogador.innerHTML = `${socket.id} - ${jogador.pontuação}`
        listaDeJogadores.appendChild(modeloJogador.cloneNode(true))
    
        run(jogador);
    });
    
    socketRecebe("jogadores", (jogador) => {
    
        console.log("passou")
        
        const cursor = new Cursor(modeloCursor.cloneNode(true),2,2,jogador.id);
        tabuleiro.appendChild(cursor.element);
        jogadores.push({id: jogador.id, pontuação: jogador.pontuação,cursor: cursor});
    
        modeloJogador.classList.add(`jogador${jogador.id}`);
        modeloJogador.innerHTML = `${jogador.id} - ${jogador.pontuação}`
        listaDeJogadores.appendChild(modeloJogador.cloneNode(true))
    });*/
    
    /*const run = (jogador) => {
    
        const ponto = new Ponto(modeloPonto.cloneNode(true));
        tabuleiro.appendChild(ponto.element);
    
        checarControle(jogador.cursor);
        
        setInterval(() => {
            
            checarControle(jogador.cursor);
        
            if(jogador.cursor.x === ponto.x && jogador.cursor.y === ponto.y){
        
                jogador.pontuação++;
    
                document.querySelector(`.jogador${jogador.id}`).innerHTML = `${jogador.id} - Score: ${jogador.pontuação}`;
                ponto.troca();
            }
    
        
        },80);
    }*/