import view from "./view.js";
import Tabuleiro from "./Tabuleiro.js";
import Network from "./Network.js";

console.log(localStorage.getItem('usuário'))
if(localStorage.getItem('usuário') === null && localStorage.getItem('usuário') === null){

    console.log("Aqui")
    window.stop();
    window.location.href = "/index.html";
}

const pointSound = new Audio("/game/point.mp3");

const network = new Network([game]);

let tabuleiro;

function game(comando,dados){

    const metodos = {

        'conectou': enviarUsuário,
        'logado': criarTabuleiro,
        'setup': setup,
        'update': atualizarJogador,
        'adicionar-ponto': adicionarPonto,
        'remover-ponto': removerPonto,
        'adicionar-jogador': adicionarJogador,
        'remover-jogador': removerJogador,
        'marcou-ponto': marqueiPonto,
        'adversário-marcou-ponto': marcaramPonto,
        'todos-marcaram-ponto': marcamosPonto
    };

    if(metodos[comando] !== undefined) metodos[comando](dados);
    else console.log(`> "${comando}" não faz parte dos métodos implementados no game.`);
}

function enviarUsuário(){

    console.log(`       game.js:    > Meu socket: ${network.socket.id}`);

    if(localStorage.getItem('game-id') === null) network.enviar("login-jogador",{nome: localStorage.getItem('usuário')});
    else network.enviar("login-jogador",{gameId: localStorage.getItem('game-id')});
}

function criarTabuleiro(id){

    tabuleiro = new Tabuleiro([view]);
    tabuleiro.atualizarId(id);
    localStorage.setItem('game-id',id);
}

function setup({jogadores,pontos}){

    console.log(`       game.js:    > Preparando setup.`);

    for(const jogador in jogadores) tabuleiro.adicionarJogador(jogadores[jogador]);
    for(const ponto in pontos) tabuleiro.adicionarPonto(pontos[ponto]);

    console.log(`       game.js:    > Setup Feito: ${Object.keys(jogadores).length} jogadores e ${Object.keys(pontos).length} pontos adicionados.`);

    run();
}

function run(){

    setInterval(() => {
        
        if(direcional !== ""){
        
            tabuleiro.moverJogador(direcional);
            network.enviar("movimentação",tabuleiro.jogadores[tabuleiro.id])
        }
    },100);
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

function marqueiPonto({id,pontuação}){

    pointSound.play();
    tabuleiro.animarPontuação(id,pontuação);
    tabuleiro.pontuarJogador(tabuleiro.id,pontuação);
}

function marcaramPonto({id,pontuação}){

    tabuleiro.pontuarJogador(id,pontuação);
}

function marcamosPonto({id,pontuação}){

    tabuleiro.animarPontuação(id,pontuação);
    for(const prop in tabuleiro.jogadores) tabuleiro.pontuarJogador(prop,pontuação);
}