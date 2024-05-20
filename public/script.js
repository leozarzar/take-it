const tabuleiro = document.querySelector(".tabuleiro");
const elementoPontuação = document.querySelector(".pontuação");
const listaDeJogadores = document.querySelector(".lista-de-jogadores");
const modeloJogador = document.querySelector(".jogador").cloneNode(true);
document.querySelector(".jogador").remove();
const modeloCursor = document.querySelector(".cursor").cloneNode(true);
document.querySelector(".cursor").remove();
const modeloPonto = document.querySelector(".ponto").cloneNode(true);
document.querySelector(".ponto").remove();

let pontuação = 0;

elementoPontuação.innerHTML = `Score: ${pontuação}`;

const jogadores = [];

const ponto = new Ponto(modeloPonto.cloneNode(true));
tabuleiro.appendChild(ponto.element);

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

socketRecebe('update', (data) => { 

    data.toRemove.forEach((apagado)=>{

        const jogador = jogadores.find((jogador) => {
            if(jogador.id === apagado.id) return true;
        });

        jogador.cursor.element.remove();
        jogadores.splice(jogadores.indexOf(jogadores.find(jogador => jogador.id === apagado.id)),1);
    })

    data.jogadores.forEach((jogadorServer) => {

        const jogador = jogadores.find((jogador) => {
            if(jogador.id === jogadorServer.id) return true;
        });

        if(jogador === undefined){

            const cursor = new Cursor(modeloCursor.cloneNode(true),jogadorServer.posição.x,jogadorServer.posição.y,jogadorServer.id);
            tabuleiro.appendChild(cursor.element);
            const jogador = {id: jogadorServer.id, pontuação: jogadorServer.pontuação,cursor: cursor};
            jogadores.push(jogador);
            //modeloJogador.classList.add(`jogador${socket.id}`);
            //modeloJogador.innerHTML = `${socket.id} - ${jogador.pontuação}`
            //listaDeJogadores.appendChild(modeloJogador.cloneNode(true))
        }
        else jogador.cursor.mover(jogadorServer.posição.x,jogadorServer.posição.y);

    });

    ponto.mover(data.ponto.x,data.ponto.y);
})