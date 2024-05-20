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

socketConecta(() => {

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
});

const run = (jogador) => {

    const ponto = new Ponto(modeloPonto.cloneNode(true));
    tabuleiro.appendChild(ponto.element);

    checarControle(jogador.cursor);
    
    setInterval(() => {
        
        checarControle(jogador.cursor);
    
        if(jogador.cursor.x === ponto.x && jogador.cursor.y === ponto.y){
    
            jogador.pontuação++;
            elementoPontuação.innerHTML = `Score: ${jogador.pontuação}`;
            ponto.troca();
        }
    
    },80);
}
