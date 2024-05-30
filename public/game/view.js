const tabuleiro = document.querySelector(".tabuleiro");
const placarGeral = document.querySelector(".placar-geral");
const modeloPlacar = document.querySelector(".placar");
const modeloCursor = document.querySelector(".cursor");
const modeloPonto = document.querySelector(".ponto");

const pointSound = new Audio("/game/point.mp3");

const margemTabuleiro = 2;
let larguraTabuleiro;

const ponto = new Ponto(modeloPonto.cloneNode(true));
tabuleiro.appendChild(ponto.ponto);

function ordenarLista(){
    
    jogadores
    .map((jogador)=>[jogador.pontuação,jogador.id])
    .sort((a,b)=>b[0]-a[0])
    .forEach((element)=>{
        const child = placarGeral.querySelector(`.placar${element[1]}`);
        placarGeral.appendChild(child);
    });
} 
function printarTabuleiro(){

    larguraTabuleiro = (Math.floor(window.innerWidth * 0.8 / 20) * 20);
    
    if(window.innerWidth < 800){

        larguraTabuleiro = larguraTabuleiro > Math.floor((window.innerHeight * 0.5)/20)*20 ? Math.ceil((window.innerHeight * 0.5)/20)*20 : larguraTabuleiro;
        larguraTabuleiro = larguraTabuleiro < 220 ? 220 : larguraTabuleiro;
    }
    else{

        larguraTabuleiro = larguraTabuleiro > Math.floor((window.innerHeight * 0.65)/20)*20 ? Math.ceil((window.innerHeight * 0.65)/20)*20 : larguraTabuleiro;
        larguraTabuleiro = larguraTabuleiro < 260 ? 260 : larguraTabuleiro;
    }
    larguraTabuleiro = larguraTabuleiro + 2*margemTabuleiro;
    tabuleiro.style.width = `${larguraTabuleiro}px`;
    tabuleiro.style.height = `${larguraTabuleiro}px`;
    pixel = Math.floor(larguraTabuleiro/20);
    
    window.scrollTo(0, 0);
}