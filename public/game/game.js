import view from "./view.js";
import Tabuleiro from "./Tabuleiro.js";
import Network from "./Network.js";

const pointSound = new Audio("/game/point.mp3");

const network = new Network([game]);

const tabuleiro = new Tabuleiro([view],network.socket.id);

function game(comando,dados){

    const metodos = {

        'conectou': enviarUsuário,
        'setup': setup,
        'estou-no-jogo': run,
        'update': tabuleiro.atualizarJogador,
        'adicionar-ponto': tabuleiro.adicionarPonto,
        'remover-ponto': tabuleiro.removerPonto,
        'adicionar-jogador': tabuleiro.adicionarJogador,
        'remover-jogador': tabuleiro.removerJogador,
        'marcou-ponto': marqueiPonto,
        'adversário-marcou-ponto': marcaramPonto,
        'todos-marcaram-ponto': marcamosPonto
    };

    if(metodos[comando] !== undefined) metodos[comando](dados);
    else console.log(`> "${comando}" não faz parte dos métodos implementados no game.`);
}

function enviarUsuário(){

    network.enviar("usuário",localStorage.getItem('usuário'));
}

function setup({jogadores,pontos}){

    console.log(`> Setup Feito: ${jogadores.length} jogadores e ${pontos.length} adicionado.`);
            
    for(const jogador in jogadores) tabuleiro.adicionarJogador(jogador,network.socket.id);
    for(const ponto in pontos) tabuleiro.adicionarPonto(ponto);
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