const modeloTabuleiro = document.querySelector(".tabuleiro");
const modeloPlacarGeral = document.querySelector(".placar-geral");
const modeloPlacar = document.querySelector(".placar");
const modeloCursor = document.querySelector(".cursor");
const modeloPonto = document.querySelector(".ponto");
const modeloPontuação = document.querySelector(".pontuação");

const margemTabuleiro = 2;
let larguraTabuleiro;

let pixel;

window.addEventListener('resize', () => { view('printar-tabuleiro') });

function view(comando,dados){

    const metodos = {

        'criou-tabuleiro': printarTabuleiro,
        'criou-ponto': criarPonto,
        'posicionou-ponto': printarPonto,
        'removeu-ponto': apagarPonto,
        'animar-ponto': animarPonto,
        'criou-jogador': criarJogador,
        'posicionou-jogador': printarJogador,
        'quando-criar-placar': criarPlacar,
        'quando-atualizar-placar': printarPlacar,
        'pontuou-jogador': printarPlacar,
        'ordenar-placar': ordenarPlacar
    };

    if(metodos[comando] !== undefined) metodos[comando](dados);
    else console.log(`> "${comando}" não faz parte dos métodos implementados.`);
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

function criarPonto(dados){

    const ponto = modeloPonto.cloneNode(true);
    ponto.children[0].hidden = false;
    ponto.classList.add(`ponto${dados.id}`);

    modeloTabuleiro.appendChild(ponto);

    printarPonto(dados);

    return ponto;
}

function printarPonto(dados){

    const ponto = modeloTabuleiro.querySelector(`.ponto${dados.id}`);

    if(dados.tipo === "especial"){
        
        const cores = ["rgb(255, 226, 64)","rgb(255, 89, 64)","rgb(0, 247, 255)"];
        const size = 12/20;

        const interval = setInterval( () => {
            
            ponto.children[0].style.width = `${Math.ceil(pixel*size)}px`;
            ponto.children[0].style.height = `${Math.ceil(pixel*size)}px`;
            ponto.children[0].style.background = cores[0];
            cores.push(cores.shift());

        }, 100);

        setTimeout( () => {

            clearInterval(interval);

        }, 4000)
    }
    else if(dados.tipo === "explosivo"){

        const cores = ["#FFFFFF","#F59B89","#F42800","#F59B89"];
        const size = [8/20,10/20,12/20,10/20];

        const interval = setInterval( () => {

            ponto.children[0].style.width = `${Math.ceil(pixel*size[0])}px`;
            ponto.children[0].style.height = `${Math.ceil(pixel*size[0])}px`;
            ponto.children[0].style.background = cores[0];
            cores.push(cores.shift());
            size.push(size.shift());

        }, 200);

        setTimeout( () => {

            clearInterval(interval);

        }, 6000)
    }
    else{

        const size = 8/20;
        ponto.children[0].style.width = `${Math.ceil(pixel*size)}px`;
        ponto.children[0].style.height = `${Math.ceil(pixel*size)}px`;
        ponto.children[0].style.background = "#FFFFFF";
    }
    
    ponto.style.width = `${pixel}px`;
    ponto.style.height = `${pixel}px`;
    ponto.style.top = `${margemTabuleiro+pixel*(dados.y-1)}px`;
    ponto.style.left = `${margemTabuleiro+pixel*(dados.x-1)}px`;
}

function apagarPonto(dados){

    modeloTabuleiro.querySelector(`.ponto${dados.id}`).remove();
}

function animarPonto(dados){

    const animação = modeloPontuação.cloneNode(true);
    animação.children[0].innerHTML = `${dados.pontuação >= 0 ? "+" + dados.pontuação : dados.pontuação}`;
    animação.children[0].hidden = false;
    modeloTabuleiro.appendChild(animação);
    const color = dados.pontuação >= 0 ? "71, 255, 47" : "255, 61, 47";

    let timer = 0;
    let alpha = 0.0;

    const interval = setInterval(() => {

        animação.style.width = `${pixel}px`;
        animação.style.height = `${pixel}px`;
        animação.style.top = `${margemTabuleiro+pixel*(dados.y-1)-pixel-(timer/50)}px`;
        animação.style.left = `${margemTabuleiro+pixel*(dados.x-1)}px`;

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

function criarJogador(dados){

    const jogador = modeloCursor.cloneNode(true);
    jogador.hidden = false;
    jogador.classList.add(`cursor${dados.id}`);
    if(dados.meu) jogador.classList.add(`meu-cursor`);
        
    modeloTabuleiro.appendChild(jogador);

    printarJogador(dados);

    criarPlacar(dados);
}

function printarJogador(dados){
    
    const jogador = modeloTabuleiro.querySelector(`.cursor${dados.id}`);
    jogador.style.width = `${pixel}px`;
    jogador.style.height = `${pixel}px`;
    jogador.style.top = `${margemTabuleiro+pixel*(dados.y-1)}px`;
    jogador.style.left = `${margemTabuleiro+pixel*(dados.x-1)}px`;
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
}

function ordenarPlacar(){
    
    tabuleiro.jogadores
    .map((jogador)=>[jogador.pontuação,jogador.id])
    .sort((a,b)=>b[0]-a[0])
    .forEach((element)=>{
        const child = modeloPlacarGeral.querySelector(`.placar${element[1]}`);
        modeloPlacarGeral.appendChild(child);
    });
} 

export default view;