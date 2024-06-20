import view from "./view.js";
import Tabuleiro from "./Tabuleiro.js";
import Network from "./Network.js";
import touch from "./touchInput.js";
import keyboard from "./keyboardInput.js";

let controle;

if(window.matchMedia("(pointer: coarse)").matches === false) {

    document.querySelector('.controlador-touch').remove();
    controle = keyboard;
}
else controle = touch;

const metodos = {

    'conectou': enviarUsuário,
    'recebeu-args': salvarArgs,
    'logado': criarTabuleiro,
    'setup': setup,
    'update': atualizarJogador,
    'adicionar-ponto': adicionarPonto,
    'remover-ponto': removerPonto,
    'adicionar-jogador': adicionarJogador,
    'remover-jogador': removerJogador,
    'marcou-ponto': marqueiPonto,
    'adversário-marcou-ponto': marcaramPonto,
    'todos-marcaram-ponto': marcamosPonto,
    'rodou-temporizador': atualizarTempo,
    'gameover': gameover
};

function game(comando,dados){

    if(metodos[comando] !== undefined) metodos[comando](dados);
    else if(!args.includes('quiet')) console.log(`> "${comando}" não faz parte dos métodos implementados no game.js.`);
}

const observers = [view];

function notifyAll(comando,dados){

    for(const observer of observers) observer(comando,dados);
}

let args = [];

const pointSound = new Audio("/game/sound-effects/point.mp3");
const boomSound = new Audio("/game/sound-effects/boom.mp3");
const specialSound = new Audio("/game/sound-effects/special-point.mp3");
const gameoverSound = new Audio("/game/sound-effects/gameover.mp3");
const recordeSound = new Audio("/game/sound-effects/recorde.mp3");

const network = new Network([game]);

let tabuleiro;

// Esses métodos são chamados via observer.

function enviarUsuário(){

    console.log(`       game.js:    > Meu socket: ${network.socket.id}`);

    if(sessionStorage.getItem('game-id') == null){

        if(sessionStorage.getItem('usuário') !== null) 
            network.enviar("login-jogador",{nome: sessionStorage.getItem('usuário')});

        else
            window.location.href = "/index.html";
    }
    else{

        network.enviar("login-jogador",{gameId: sessionStorage.getItem('game-id')});
    }
}

function salvarArgs(dados){

    args = dados;
    view('args',args);
}

function criarTabuleiro(id){

    if(id !== null){

        tabuleiro = new Tabuleiro([view]);
        tabuleiro.atualizarId(id);
        sessionStorage.setItem('game-id',id);
    }
    else{

        sessionStorage.removeItem('usuário');
        sessionStorage.removeItem('game-id');
        window.location.href = "/index.html";
    }
}

function setup({jogadores,pontos}){

    console.log(`       game.js:    > Preparando setup.`);

    for(const jogador in jogadores) tabuleiro.adicionarJogador(jogadores[jogador]);
    for(const ponto in pontos) tabuleiro.adicionarPonto(pontos[ponto]);

    console.log(`       game.js:    > Setup Feito: ${Object.keys(jogadores).length} jogadores e ${Object.keys(pontos).length} pontos adicionados.`);

    controle.run(move);
}

function atualizarJogador(jogador){

    tabuleiro.atualizarJogador(jogador);
}

function adicionarPonto(ponto){

    tabuleiro.adicionarPonto(ponto);
}

function removerPonto(ponto){

    tabuleiro.removerPonto(ponto);
}

function adicionarJogador(jogador){

    tabuleiro.adicionarJogador(jogador);
}

function removerJogador(jogador){

    tabuleiro.removerJogador(jogador);
}

function marqueiPonto({ponto,pontuação}){

    if(ponto.tipo === 'especial') specialSound.play();
    else{
        pointSound.load();
        pointSound.play();
    }
    tabuleiro.animarPontuação(ponto.id,pontuação);
    tabuleiro.pontuarJogador(tabuleiro.id,pontuação);
}

function marcaramPonto({id,pontuação}){

    tabuleiro.pontuarJogador(id,pontuação);
}

function marcamosPonto({ponto,pontuação}){

    if(ponto.tipo === 'explosivo') boomSound.play();
    tabuleiro.animarPontuação(ponto.id,pontuação);
    for(const prop in tabuleiro.jogadores) tabuleiro.pontuarJogador(prop,pontuação);
}

function atualizarTempo(tempo){

    notifyAll('rodou-temporizador',tempo);
}

function gameover(){

    const pontuação = tabuleiro.jogadores[tabuleiro.id].pontuação;
    let recorde = localStorage.getItem('recorde') !== null ? Number.parseInt(localStorage.getItem('recorde')) : 0;
    const resultado = pontuação;

    if(resultado > recorde){

        recorde = resultado;
        localStorage.setItem('recorde', recorde);
        recordeSound.play();
    }
    else gameoverSound.play();

    controle.shutdown();
    tabuleiro.jogadores[tabuleiro.id].zerarPontuação();
    notifyAll('rodou-gameover',{resultado: resultado, recorde: recorde});
    network.enviar("");
    console.log(`       game.js:    > GAME OVER`);
}

// Esses métodos são chamados dentro do documento.

function move(direcional){

    tabuleiro.moverJogador(direcional);
    network.enviar("movimentação",tabuleiro.jogadores[tabuleiro.id])
}