const modeloTabuleiro = document.querySelector(".tabuleiro");
const modeloPlacarGeral = document.querySelector(".placar-geral");
const modeloPlacar = document.querySelector(".placar");
const modeloCursor = document.querySelector(".cursor");
const modeloPonto = document.querySelector(".ponto");

const pointSound = new Audio("/game/point.mp3");

coresEspecial = ["#ffe240","#ff5940","#00f7ff"];

const margemTabuleiro = 2;
let larguraTabuleiro;

function ordenarLista(){
    
    jogadores
    .map((jogador)=>[jogador.pontuação,jogador.id])
    .sort((a,b)=>b[0]-a[0])
    .forEach((element)=>{
        const child = modeloPlacarGeral.querySelector(`.placar${element[1]}`);
        modeloPlacarGeral.appendChild(child);
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
    modeloTabuleiro.style.width = `${larguraTabuleiro}px`;
    modeloTabuleiro.style.height = `${larguraTabuleiro}px`;
    pixel = Math.floor(larguraTabuleiro/20);
    
    window.scrollTo(0, 0);
}

function atualizarPonto(ponto){

        if(ponto.tipo === "especial"){

            coresEspecial.push(coresEspecial.shift());
            ponto.elemento.children[0].style.background = coresEspecial[0];
        }
        else ponto.elemento.children[0].style.background = "#FFFFFF";
        
        ponto.elemento.style.width = `${pixel}px`;
        ponto.elemento.style.height = `${pixel}px`;
        ponto.elemento.style.top = `${margemTabuleiro+pixel*(ponto.y-1)}px`;
        ponto.elemento.style.left = `${margemTabuleiro+pixel*(ponto.x-1)}px`;
}

function criarPonto(){

    const ponto = modeloPonto.cloneNode(true);
    ponto.children[0].hidden = false;

    modeloTabuleiro.appendChild(ponto);

    return ponto;
}