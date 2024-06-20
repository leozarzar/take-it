const tabuleiroPontos = document.querySelector(".tabuleiro-pontos");
const tabuleiroJogadores = document.querySelector(".tabuleiro-jogadores");
const tabuleiroAnimações = document.querySelector(".tabuleiro-animações");
const modeloPlacarGeral = document.querySelector(".placar-geral");
const modeloPlacar = document.querySelector(".placar");
const pontuação = document.querySelector(".pontuação");
const tempo = document.querySelector(".tempo");
const telaGameOver = document.querySelector(".tela-game-over");
const elementoRecorde = document.querySelector(".recorde");
const elementoResultado = document.querySelector(".resultado");

const margemTabuleiro = 2;
let larguraTabuleiro;

console.log(tabuleiroPontos.width);
const pixel = tabuleiroPontos.width/20;

const pontosContext = tabuleiroPontos.getContext("2d");
const jogadoresContext = tabuleiroJogadores.getContext("2d");
const animaçõesContext = tabuleiroAnimações.getContext("2d");

pontosContext.fillStyle = "white";
jogadoresContext.fillStyle = "white";
animaçõesContext.fillStyle = "white";

window.addEventListener('resize', () => { view('printar-tabuleiro') });

const countdownSound = new Audio("/game/sound-effects/countdown.mp3");

let args = [];

const metodos = {

    'args': salvarArgs,
    'rodou-temporizador': printarTempo,
    'criou-ponto': printarPonto,
    'removeu-ponto': limparPonto,
    'animar-ponto': animarPonto,
    'criou-jogador': printarJogador,
    'jogador-adicionado': ordenarPlacar,
    'moveu-jogador': reprintarJogadores,
    'removeu-jogador': limparJogador,
    'quando-atualizar-placar': printarPlacar,
    'pontuou-jogador': printarPlacar,
    'jogador-pontuou': ordenarPlacar,
    'rodou-gameover': printarGameover,
};

function view(comando,dados){

    if(metodos[comando] !== undefined) metodos[comando](dados);
    else if(!args.includes('quiet')) console.log(`> "${comando}" não faz parte dos métodos implementados no view.js.`);
}

function salvarArgs(dados){

    args = dados;
}

function printarTempo(tempoRestante){

    if(tempoRestante < 10) tempo.style.color = "red";
    const duração = new Date(tempoRestante*1000);
    const relógio = duração.toLocaleString('pt-Br',{minute: '2-digit',second: '2-digit'});
    tempo.innerHTML = `${relógio}`;
}

function limparPonto(dados){

    pontosContext.clearRect((dados.x-1)*pixel,(dados.y-1)*pixel,pixel,pixel);
}

function printarPonto(dados){

    if(dados.tipo === "especial"){
        
        const cores = ["hsl(178, 100%, 75%)","hsl(58, 100%, 75%)","hsl(0, 100%, 75%)"];

        const interval = setInterval( () => {
            
            pontosContext.clearRect((dados.x-1)*pixel,(dados.y-1)*pixel,pixel,pixel);
            pontosContext.fillStyle = cores[0];
            pontosContext.beginPath();
            pontosContext.arc((dados.x-1)*pixel+pixel/2,(dados.y-1)*pixel+pixel/2,pixel*0.5*0.5,0,Math.PI*2);
            pontosContext.fill();
            cores.push(cores.shift());

        }, 100);

        dados.observers.push((comando,ponto) => {

            if(comando === 'removeu-ponto' && ponto === dados){

                clearInterval(interval);
                pontosContext.clearRect((dados.x-1)*pixel,(dados.y-1)*pixel,pixel,pixel);
            }
        })
    }
    else if(dados.tipo === "explosivo"){

        countdownSound.play();
        let i = 0;
        let cresce = true;

        const interval = setInterval( () => {
            
            pontosContext.clearRect((dados.x-1)*pixel,(dados.y-1)*pixel,pixel,pixel);
            pontosContext.fillStyle = `hsl(0,100%,${100-i*0.5}%)`;
            pontosContext.beginPath();
            pontosContext.arc((dados.x-1)*pixel+pixel/2,(dados.y-1)*pixel+pixel/2,pixel*(0.4+0.2*i/100)*0.5,0,Math.PI*2);
            pontosContext.fill();
            if(i === 0) cresce = true;
            if(i === 100) cresce = false;
            if(cresce && i<100) i = i + 10;
            if(!cresce && i>0) i = i - 10;

        }, 50);

        dados.observers.push((comando,ponto) => {

            if(comando === 'removeu-ponto' && ponto === dados){

                countdownSound.load();
                clearInterval(interval);
                pontosContext.clearRect((dados.x-1)*pixel,(dados.y-1)*pixel,pixel,pixel);
            }
        })
    }
    else{

        pontosContext.fillStyle = "white";
        pontosContext.beginPath();
        pontosContext.arc((dados.x-1)*pixel+pixel/2,(dados.y-1)*pixel+pixel/2,pixel*0.4*0.5,0,Math.PI*2);
        pontosContext.fill();
    }
}

function printarJogador(dados){

    if(dados.meu === true) jogadoresContext.fillStyle = "white";
    else jogadoresContext.fillStyle = "rgb(254, 113, 113)";
    desenharCursor(jogadoresContext,{x: dados.x, y: dados.y});

    criarPlacar(dados);
}

function reprintarJogadores(dados){

    jogadoresContext.clearRect(0,0,tabuleiroJogadores.width,tabuleiroJogadores.height);

    let meuJogador;

    for(const jogador in dados.jogadores){

        if(dados.jogadores[jogador].meu === true){
            
            meuJogador = dados.jogadores[jogador];
        }
        else {

            jogadoresContext.fillStyle = "rgb(254, 113, 113)";
            desenharCursor(jogadoresContext,{x: dados.jogadores[jogador].x, y: dados.jogadores[jogador].y});
        }
    }

    jogadoresContext.fillStyle = "white";
    desenharCursor(jogadoresContext,{x: meuJogador.x, y: meuJogador.y});
}

function desenharCursor(context,posição){

    const raio = pixel/6;
    const padding = pixel/15;
    posição = {x: (posição.x-1)*pixel,y: (posição.y-1)*pixel}
    const A = {x: posição.x+raio+padding, y: posição.y+padding}
    const B = {x: posição.x+pixel-raio-padding, y: posição.y+padding}
    const C = {x: posição.x+pixel-raio-padding, y: posição.y+raio+padding}
    const D = {x: posição.x+pixel-padding, y: posição.y+pixel-raio-padding}
    const E = {x: posição.x+pixel-raio-padding, y: posição.y+pixel-raio-padding}
    const F = {x: posição.x+raio+padding, y: posição.y+pixel-padding}
    const G = {x: posição.x+raio+padding, y: posição.y+pixel-raio-padding}
    const H = {x: posição.x+padding, y: posição.y+raio+padding}
    const I = {x: posição.x+raio+padding, y: posição.y+raio+padding}

    context.beginPath();
    context.moveTo(A.x, A.y);
    context.lineTo(B.x, B.y);
    context.arc(C.x,C.y,raio,-Math.PI/2,0);
    context.lineTo(D.x,D.y);
    context.arc(E.x,E.y,raio,0,Math.PI/2);
    context.lineTo(F.x,F.y);
    context.arc(G.x,G.y,raio,Math.PI/2,Math.PI);
    context.lineTo(H.x,H.y);
    context.arc(I.x,I.y,raio,Math.PI,-Math.PI/2);
    context.fill()
}

function limparJogador(dados){

    jogadoresContext.clearRect((dados.x-1)*pixel,(dados.y-1)*pixel,pixel,pixel);
    modeloPlacarGeral.querySelector(`.placar${dados.id}`).remove();
}

function animarPonto(dados){

    animaçõesContext.font = "bold 20px Poppins";
    const color = dados.pontuação >= 0 ? `143, 255, 158` : "255, 95, 92";
    const text = `${dados.pontuação >= 0 ? "+" + dados.pontuação : dados.pontuação}`;

    let timer = 0;
    let alpha = 0.0;

    const interval = setInterval(() => {

        animaçõesContext.fillStyle = `rgb( ${color}, ${alpha})`;

        if(timer <= 200) alpha = alpha + 0.1;
        if(timer >= 800) alpha = alpha - 0.1;

        animaçõesContext.clearRect((dados.x-1)*pixel+pixel*-0.0,60+(dados.y-1)*pixel-pixel*0.1-pixel*timer/1000+15-pixel,pixel*1.0,pixel);
        animaçõesContext.fillText(text,(dados.x-1)*pixel+pixel*-0.0,60+(dados.y-1)*pixel-pixel*0.1-pixel*timer/1000,pixel*1.0); 

        if(timer > 1000){

            clearInterval(interval);
        }

        timer = timer + 20;
    },20);
}

function criarPlacar(dados){

    const placar = modeloPlacar.cloneNode(true);
    placar.hidden = false;
    placar.classList.add(`placar${dados.id}`);
    if(dados.meu) placar.classList.add(`meu-placar`);
        
    modeloPlacarGeral.appendChild(placar);

    printarPlacar(dados);
}

function printarPlacar(dados){
    
    modeloPlacarGeral.querySelector(`.placar${dados.id}`).innerHTML = `${dados.nome} - ${dados.pontuação}`;
    if(dados.meu) pontuação.innerHTML = dados.pontuação.toString().padStart(6,'0');
}

function ordenarPlacar(dados){
    
    Object.values(dados.jogadores)
    .map((jogador)=>[jogador.pontuação,jogador.id])
    .sort((a,b)=>b[0]-a[0])
    .forEach((element)=>{
        const child = modeloPlacarGeral.querySelector(`.placar${element[1]}`);
        modeloPlacarGeral.appendChild(child);
    });
}

function printarGameover({resultado,recorde}){

    if(resultado === recorde) elementoRecorde.style.color = 'limegreen';
    elementoResultado.innerHTML = resultado.toString().padStart(6,'0');
    elementoRecorde.innerHTML = recorde.toString().padStart(6,'0');

    tempo.style.color = "yellow";
    telaGameOver.style.display = 'flex';

    let interval;
    let counter = 0;

    interval = setInterval(()=>{

        counter = counter+0.05;
        telaGameOver.style.opacity = `${counter}`;
        if(counter >= 1) clearInterval(interval);
    },10)
}

export default view;