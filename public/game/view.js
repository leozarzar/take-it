const tabuleiro = document.querySelector(".tabuleiro");
const placarGeral = document.querySelector(".placar-geral");
const modeloPlacar = document.querySelector(".placar");
const modeloCursor = document.querySelector(".cursor");
const modeloPonto = document.querySelector(".ponto");

const pointSound = new Audio("/game/point.mp3");

coresEspecial = [];
coresEspecial.push("#ffe240");
coresEspecial.push("#ff5940");
coresEspecial.push("#00f7ff");

const margemTabuleiro = 2;
let larguraTabuleiro;

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

function atualizarPontos(){

    return (state) => {

        if(state.especial){

            coresEspecial.push(coresEspecial.shift());
            state.ponto.children[0].style.background = coresEspecial[0];
        }
        else state.ponto.children[0].style.background = "#FFFFFF";
        
        state.ponto.style.width = `${pixel}px`;
        state.ponto.style.height = `${pixel}px`;
        state.ponto.style.top = `${margemTabuleiro+pixel*(state.y-1)}px`;
        state.ponto.style.left = `${margemTabuleiro+pixel*(state.x-1)}px`;
    }
}

function criarPonto(){

    const ponto = modeloPonto.cloneNode(true);
    ponto.children[0].hidden = false;

    tabuleiro.appendChild(ponto);

    return ponto;
}