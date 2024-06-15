import Tabuleiro from "../public/game/Tabuleiro.js";
import criarServer from "./server.js"

const metodos = {

    'novo-jogador': adicionarJogador,
    'criou-jogador': comunicarNovoJogador,
    'nova-movimentação': moverJogador,
    'desconectou': removerJogador,
    'removeu-jogador': comunicarRemoçãoDeJogador,
    'criou-ponto': comunicarNovoPonto,
    'removeu-ponto': responderPontoRemovido,
};

function game(comando,dados){

    if(metodos[comando] !== undefined) metodos[comando](dados);
    else if(!process.argv.includes('quiet',2)) console.log(`       game.js:    > "${comando}" não faz parte dos métodos implementados.`);
}

const contador = {tempo: 0, especial: 5, novoPonto: 0, bomba: 10};
const quantidadeDePontos = 6;
const tempoDeTeste = 15;
const tempoPadrão = 120;

const server = criarServer([game]);

const tabuleiro = new Tabuleiro([game]);

const clients = {};
const timeouts = {};
let interval;

seedPontos();

// Esses métodos são chamados via observer.

function adicionarJogador({usuário,nome,gameId}){

    if(gameId === undefined){
        
        const novoGameId = Math.random().toString(36).slice(-10);
        tabuleiro.adicionarJogador({id: novoGameId, nome: nome});
        server.enviar('logado',usuário,{gameId: novoGameId, args: process.argv.slice(2)});
        clients[usuário.id] = novoGameId;
        server.enviar('setup',usuário,{jogadores: tabuleiro.exportarJogadores(), pontos: tabuleiro.exportarPontos()});
        iniciarTemporizador();
    }
    else{
        
        if(tabuleiro.selecionarJogador(gameId) === undefined){

            server.enviar('logado',usuário,{gameId: null, args: process.argv.slice(2)});
        }
        else{

            server.enviar('logado',usuário,{gameId: gameId, args: process.argv.slice(2)});
            clients[usuário.id] = gameId;
            clearTimeout(timeouts[gameId]);
            delete timeouts[gameId];
            server.enviar('setup',usuário,{jogadores: tabuleiro.exportarJogadores(), pontos: tabuleiro.exportarPontos()});
            iniciarTemporizador();
        }
    }
}

function comunicarNovoJogador(novoJogador){

    server.enviarParaTodos("add-player",novoJogador);
}

function moverJogador({usuário,id,x,y}){

    const jogador = tabuleiro.jogadores[id];
    
    jogador.transportar({x: x, y: y});

    checarColisão(usuário,jogador);

    server.enviarParaTodosMenos('update',usuário,jogador);
}

function removerJogador({usuário}){

    if(clients[usuário.id] === undefined) return;
    const gameId = clients[usuário.id];
    delete clients[usuário.id];

    const timeout = setTimeout(() => {

        tabuleiro.removerJogador(gameId);
        delete timeouts[gameId];

    },20000)

    timeouts[gameId] = timeout;
}

function comunicarRemoçãoDeJogador({id}){
    
    server.enviarParaTodos("remove-player",id);
}

function checarColisão(usuário,jogador){

    for(const prop in tabuleiro.pontos){

        const ponto = tabuleiro.pontos[prop];

        if(ponto.colidiu(jogador)){

            console.log(`       game.js:    > Jogador "${jogador.nome}" colidiu com o ponto "${ponto.id}" na posição (${ponto.x},${ponto.y}).`);
            const pontuação = ponto.tipo === "especial" ? 50 : 10;
            jogador.pontuar(pontuação);
            server.enviar("my-point",usuário,{ponto: ponto, pontuação: pontuação});
            server.enviarParaTodosMenos("someones-point",usuário,{id: jogador.id, pontuação: pontuação});
            tabuleiro.removerPonto(ponto);
        }
    }
}

function comunicarNovoPonto(novoPonto){

    const tempo = {
        "especial": 4000,
        "explosivo": 6000,
    }

    if(novoPonto.tipo !== "normal") setTimeout(() => {
    
        const ponto = tabuleiro.pontos[novoPonto.id];
        if(ponto) tabuleiro.removerPonto(ponto,true);

    },tempo[novoPonto.tipo])

    server.enviarParaTodos("add-point",novoPonto);
}

function responderPontoRemovido(ponto){

    if(ponto.tipo === "especial") contador.especial = Math.ceil(4+Math.random()*6);
    if(ponto.tipo === "explosivo"){

        if(ponto.autoremove){

            for(const prop in tabuleiro.jogadores) tabuleiro.jogadores[prop].pontuar(-50);
            server.enviarParaTodos("everyones-point",{ponto: ponto, pontuação: -50});
        }
        contador.bomba = Math.ceil(9+Math.random()*6);
    }
    else{
        contador.especial--;
        contador.bomba--;
    }
    server.enviarParaTodos("remove-point",ponto);
    seedPontos();
}

// Esses métodos são chamados dentro do documento.

function seedPontos(){

    setTimeout(() => {
        
        if(Object.keys(tabuleiro.pontos).length < quantidadeDePontos){

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

function iniciarTemporizador(){

    if(interval !== undefined){

        clearInterval(interval);
        for(const jogador in tabuleiro.jogadores) tabuleiro.jogadores[jogador].zerarPontuação();
    }

    let tempoRestante = process.argv.includes('test',2) ? tempoDeTeste : tempoPadrão;
    
    const temporizador = () => {

        server.enviarParaTodos('rodou-temporizador',tempoRestante);

        if(tempoRestante === 0){

            gameover();
            clearInterval(interval);
        }

        tempoRestante--;
    }

    temporizador();

    interval = setInterval(temporizador,1000)
}

function gameover(){

    server.enviarParaTodos('gameover');
    for(const jogador in tabuleiro.jogadores) tabuleiro.jogadores[jogador].zerarPontuação();
    console.log(`       game.js:    > GAME OVER`);
}