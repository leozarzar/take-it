import Tabuleiro from "../public/game/Tabuleiro.js";
import criarServer from "./server.js"

const contador = {tempo: 0, especial: 5, novoPonto: 0, bomba: 10};
const quantidadeDePontos = 6;

const server = criarServer([game]);

const tabuleiro = new Tabuleiro([game]);

seedPontos();

function game(comando,dados){

    const metodos = {

        'conectou': enviarSetup,
        'recebeu-dados-do-usuário': adicionarJogador,
        'criou-jogador': comunicarNovoJogador,
        'nova-movimentação': moverJogador,
        'desconectou': removerJogador,
        'removeu-jogador': comunicarRemoçãoDeJogador,
        'criou-ponto': comunicarNovoPonto,
        'removeu-ponto': responderPontoRemovido,
    };

    if(metodos[comando] !== undefined) metodos[comando](dados);
    else console.log(`> "${comando}" não faz parte dos métodos implementados no game.`);
}

function enviarSetup({usuário}){

    server.enviar('setup',usuário,{jogadores: tabuleiro.exportarJogadores(), pontos: tabuleiro.exportarPontos()});
}

function adicionarJogador({usuário,nome}){

    tabuleiro.adicionarJogador({id: usuário.id, nome: nome});
    server.enviar('usuário-adicionado',usuário);
}

function comunicarNovoJogador(novoJogador){

    server.enviarParaTodos("add-player",novoJogador);
}

function moverJogador({usuário,posição}){

    const jogador = tabuleiro.jogadores[usuário.id];
    
    jogador.transportar(posição);

    checarColisão(usuário,jogador);

    server.enviarParaTodosMenos('update',usuário,jogador);
}

function removerJogador({usuário}){

    tabuleiro.removerJogador(usuário.id);
}

function comunicarRemoçãoDeJogador({id}){
    
    server.enviarParaTodos("remove-player",id);
}

function checarColisão(usuário,jogador){

    tabuleiro.pontos.forEach((ponto) => {

        if(ponto.colidiu(jogador)){

            const pontuação = ponto.tipo === "especial" ? 50 : 10;
            jogador.pontuar(pontuação);
            server.enviar("my-point",usuário,{id: ponto.id, pontuação: pontuação});
            server.enviarParaTodosMenos("someones-point",usuário,{id: usuário.id, pontuação: pontuação});
            tabuleiro.removerPonto(ponto.id);
        }
    });
}

function comunicarNovoPonto(novoPonto){

    server.enviarParaTodos("add-point",novoPonto);
}

function responderPontoRemovido(index,tipo,timeout){

    if(tipo === "especial") contador.especial = Math.ceil(4+Math.random()*6);
    if(tipo === "explosivo"){

        if(timeout){

            tabuleiro.jogadores.forEach( (jogador) => {jogador.pontuar(-50)} );
            server.enviarParaTodos("everyones-point",{index: index, pontuação: -50});
        }
        contador.bomba = Math.ceil(9+Math.random()*6);
    }
    else{
        contador.especial--;
        contador.bomba--;
    }
    server.enviarParaTodos("remove-point",index);
    seedPontos();
}

function seedPontos(){

    setTimeout(() => {
        
        if(tabuleiro.pontos.length < quantidadeDePontos){
            
            if(contador.especial <=0){
                
                tabuleiro.adicionarPonto({tipo: 'especial'});
                contador.especial = 1000000;
            }
            else if(contador.bomba <=0){
                
                tabuleiro.adicionarPonto({tipo: 'explosivo'});
                contador.bomba = 1000000;
            }
            else tabuleiro.adicionarPonto({tipo: 'normal'});

            seedPontos();
        }
    
    }, Math.floor(1000 + Math.random() * 2000) );
}