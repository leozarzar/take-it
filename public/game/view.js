const modeloTabuleiro = document.querySelector(".tabuleiro");
const modeloPlacarGeral = document.querySelector(".placar-geral");
const modeloPlacar = document.querySelector(".placar");
const modeloCursor = document.querySelector(".cursor");
const modeloPonto = document.querySelector(".ponto");
const modeloPontuação = document.querySelector(".pontuação");

const pointSound = new Audio("/game/point.mp3");

const margemTabuleiro = 2;
let larguraTabuleiro;

function ordenarLista(){
    
    tabuleiro.jogadores
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

            ponto.elemento.children[0].style.width = `50%`;
            ponto.elemento.children[0].style.height = `50%`;

            switch(ponto.elemento.children[0].style.background){

                case "rgb(255, 255, 255)":
                    ponto.elemento.children[0].style.background = "rgb(255, 226, 64)";
                break;
                case "rgb(255, 226, 64)":
                    ponto.elemento.children[0].style.background = "rgb(255, 89, 64)";
                break;
                case "rgb(255, 89, 64)":
                    ponto.elemento.children[0].style.background = "rgb(0, 247, 255)";
                break;
                case "rgb(0, 247, 255)":
                    ponto.elemento.children[0].style.background = "rgb(255, 226, 64)";
                break;  
            }
        }
        else if(ponto.tipo === "explosivo"){

            switch(ponto.elemento.children[0].style.background){

                case "rgb(255, 255, 255)":
                    ponto.elemento.children[0].style.background = "rgb(238, 238, 238)";
                break;
                case "rgb(238, 238, 238)":
                    ponto.elemento.children[0].style.background = "rgb(255, 0, 0)";
                break;
                case "rgb(255, 0, 0)":
                    ponto.elemento.children[0].style.background = "rgb(238, 238, 238)";
                break; 
            }
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

function atualizarJogador(jogador){
    
    jogador.cursor.style.width = `${pixel}px`;
    jogador.cursor.style.height = `${pixel}px`;
    jogador.cursor.style.top = `${margemTabuleiro+pixel*(jogador.y-1)}px`;
    jogador.cursor.style.left = `${margemTabuleiro+pixel*(jogador.x-1)}px`;
}

function criarJogador(id,éMeu){

    const jogador = modeloCursor.cloneNode(true);
    jogador.hidden = false;
    jogador.classList.add(`cursor${id}`);
    if(éMeu) jogador.classList.add(`meu-cursor`);
        
    modeloTabuleiro.appendChild(jogador);

    return jogador;
}

function atualizarPontuação(jogador){
    
    jogador.placar.innerHTML = `${jogador.usuário} - ${jogador.pontuação}`;
}

function criarPlacar(id,éMeu){

    const placar = modeloPlacar.cloneNode(true);
    placar.hidden = false;
    placar.classList.add(`placar${id}`);
    if(éMeu) placar.classList.add(`meu-placar`);
        
    modeloPlacarGeral.appendChild(placar);

    return placar;
}

function criarAnimaçãoPonto(pontuação,ponto){

    const animação = modeloPontuação.cloneNode(true);
    animação.children[0].innerHTML = `${pontuação >= 0 ? "+" + pontuação : pontuação}`;
    animação.children[0].hidden = false;
    modeloTabuleiro.appendChild(animação);
    const color = pontuação >= 0 ? "71, 255, 47" : "255, 61, 47";

    let timer = 0;
    let alpha = 0.0;

    const interval = setInterval(() => {

        animação.style.width = `${pixel}px`;
        animação.style.height = `${pixel}px`;
        animação.style.top = `${margemTabuleiro+pixel*(ponto.y-1)-pixel-(timer/50)}px`;
        animação.style.left = `${margemTabuleiro+pixel*(ponto.x-1)}px`;

        if(timer <= 200){
            animação.children[0].style.color = `rgba(${color}, ${alpha})`;
            alpha = alpha + 0.1;
        }

        if(timer >= 800){
            animação.children[0].style.color = `rgba(${color}, ${alpha})`;
            alpha = alpha - 0.1;
        }

        if(timer > 1000){

            clearInterval(interval);
            animação.remove();
        }

        timer = timer + 20;
    },20);
}