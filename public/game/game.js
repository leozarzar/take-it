import view from "./view.js";
import Tabuleiro from "./Tabuleiro.js";
import Network from "./Network.js";


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