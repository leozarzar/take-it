import view from "./view.js";
import Tabuleiro from "./Tabuleiro.js";
import Network from "./Network.js";

const pointSound = new Audio("/game/point.mp3");

const tabuleiro = new Tabuleiro([view]);

console.log(tabuleiro);

const network = new Network([game]);

tabuleiro.atualizarId(network.socket.id);

function game(comando,dados){

    console.log(tabuleiro);
    const metodos = {

        'conectou': enviarUsuário,
        'setup': setup,
        'estou-no-jogo': run,
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

function enviarUsuário(){

    network.enviar("usuário",{nome: localStorage.getItem('usuário')});
}

function setup({jogadores,pontos}){

    for(const jogador in jogadores) tabuleiro.adicionarJogador(jogador);
    for(const ponto in pontos) tabuleiro.adicionarPonto(ponto);

    console.log(`> Setup Feito: ${Object.keys(jogadores).length} jogadores e ${Object.keys(pontos).length} pontos adicionados.`);
}

function run(){

    console.log("> Eu Fui Adicionado.");
        
    tabuleiro.selecionarJogadorLocal(tabuleiro.jogadores.find( (jogador) => (jogador.id === tabuleiro.id) ));
        
    setInterval(() => {
        
        if(direcional !== ""){
        
            tabuleiro.moverJogador(direcional);
            network.enviar("movimentação",tabuleiro.jogadores[tabuleiro.id])
        }
    },100);
}

function marqueiPonto({id,pontuação}){

    pointSound.play();
    tabuleiro.animarPontuação(id,pontuação);
    tabuleiro.jogadores[tabuleiro.id].atualizarPontuação(tabuleiro.jogadores[tabuleiro.id].pontuação+pontuação);
}

function marcaramPonto({id,pontuação}){

    tabuleiro.selecionarJogador(id).atualizarPontuação(tabuleiro.selecionarJogador(id).pontuação+pontuação);
}

function marcamosPonto({id,pontuação}){

    tabuleiro.animarPontuação(id,pontuação);
    for(const jogador in tabuleiro.jogadores) jogador.atualizarPontuação(jogador.pontuação+pontuação);
}