const tabuleiro = document.querySelector(".tabuleiro");
const modeloCursor = document.querySelector(".cursor");
const modeloPonto = document.querySelector(".ponto");
const input = document.querySelector('.nome-usuario');
const botão = document.querySelector('.botão');

const margemTabuleiro = 2;
let larguraTabuleiro;

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

input.addEventListener('input',(evt)=>{

    if(input.value !== '') botão.disabled = false;
    else botão.disabled = true;
});

botão.addEventListener('click', ()=>{

    if(sessionStorage.getItem("game-id") === undefined) sessionStorage.setItem('game-id',"new");
    sessionStorage.setItem('usuário',input.value);
    window.location.href = "/game/index.html";
});