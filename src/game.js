import Tabuleiro from "../public/game/Tabuleiro.js";
import criarServer from "./server.js";

const tempoPadrão = 120;
const tempoDeTeste = 15;
const quantidadeDePontos = 6;

// ---- Network + observer event router ----

const metodos = {
    'listar-salas':      listarSalas,
    'criar-sala':        criarSala,
    'entrar-sala':       entrarSala,
    'pronto':            marcarPronto,
    'cancelar-pronto':   cancelarPronto,
    'sair-sala':         sairSala,
    'novo-jogador':      adicionarJogador,
    'nova-movimentação': moverJogador,
    'desconectou':       desconectou,
};

function game(comando, dados) {
    if (metodos[comando] !== undefined) metodos[comando](dados);
    else if (!process.argv.includes('quiet', 2))
        console.log(`       game.js:    > "${comando}" não faz parte dos métodos implementados.`);
}

const server = criarServer([game]);

const salas = {};
const socketEmSalaLobby = {};
const socketEmSalaJogo   = {};

// ---- Helpers ----

function serializarSala(sala) {
    return {
        id: sala.id,
        nome: sala.nome,
        membros: sala.membros,
        prontos: [...sala.prontos],
        started: sala.started,
    };
}

function broadcastSalas() {
    const lista = Object.values(salas).map(serializarSala);
    server.enviarParaTodos('salas-atualizadas', lista);
}

function broadcastSala(salaId) {
    server.enviarParaSala('sala-atualizada', salaId, serializarSala(salas[salaId]));
}

function criarObservadorSala(salaId) {
    return (comando, dados) => {
        if      (comando === 'criou-jogador')   comunicarNovoJogador(salaId, dados);
        else if (comando === 'criou-ponto')     comunicarNovoPonto(salaId, dados);
        else if (comando === 'removeu-ponto')   responderPontoRemovido(salaId, dados);
        else if (comando === 'removeu-jogador') comunicarRemoçãoDeJogador(salaId, dados);
    };
}

// ---- Lobby ----

function listarSalas({ usuário }) {
    server.enviar('salas-atualizadas', usuário, Object.values(salas).map(serializarSala));
}

function criarSala({ usuário, nomeSala, nome }) {
    const id = Math.random().toString(36).slice(-10);
    salas[id] = {
        id, nome: nomeSala,
        membros: {}, prontos: new Set(),
        started: false, jogadoresEsperados: 0,
        tabuleiro: null, contador: { especial: 5, bomba: 10 },
        clients: {}, timeouts: {}, conectados: new Set(),
        interval: null, timerStarted: false,
    };
    _entrarSalaLobby(usuário, id, nome);
    broadcastSalas();
}

function entrarSala({ usuário, salaId, nome }) {
    const sala = salas[salaId];
    if (!sala || sala.started) return;
    const ant = socketEmSalaLobby[usuário.id];
    if (ant) _sairSalaLobby(usuário, ant, false);
    _entrarSalaLobby(usuário, salaId, nome);
    broadcastSalas();
}

function _entrarSalaLobby(usuário, salaId, nome) {
    const sala = salas[salaId];
    sala.membros[usuário.id] = { socketId: usuário.id, nome };
    socketEmSalaLobby[usuário.id] = salaId;
    usuário.join(salaId);
    server.enviar('entrou-sala', usuário, serializarSala(sala));
    server.enviarParaSalaMenos('sala-atualizada', salaId, usuário, serializarSala(sala));
}

function marcarPronto({ usuário }) {
    const salaId = socketEmSalaLobby[usuário.id];
    if (!salaId) return;
    salas[salaId].prontos.add(usuário.id);
    broadcastSala(salaId);
    verificarInicioJogo(salaId);
}

function cancelarPronto({ usuário }) {
    const salaId = socketEmSalaLobby[usuário.id];
    if (!salaId) return;
    salas[salaId].prontos.delete(usuário.id);
    broadcastSala(salaId);
}

function sairSala({ usuário }) {
    const salaId = socketEmSalaLobby[usuário.id];
    if (!salaId) return;
    _sairSalaLobby(usuário, salaId, true);
    broadcastSalas();
}

function _sairSalaLobby(usuário, salaId, leaveRoom) {
    const sala = salas[salaId];
    if (!sala) return;
    delete sala.membros[usuário.id];
    sala.prontos.delete(usuário.id);
    delete socketEmSalaLobby[usuário.id];
    if (leaveRoom) usuário.leave(salaId);
    if (Object.keys(sala.membros).length === 0) delete salas[salaId];
    else broadcastSala(salaId);
}

function verificarInicioJogo(salaId) {
    const sala = salas[salaId];
    const membros = Object.keys(sala.membros);
    if (membros.length === 0) return;
    if (!membros.every(id => sala.prontos.has(id))) return;

    sala.started = true;
    sala.jogadoresEsperados = membros.length;
    sala.tabuleiro = new Tabuleiro([criarObservadorSala(salaId)]);

    for (const socketId of membros) delete socketEmSalaLobby[socketId];
    sala.prontos.clear();

    server.enviarParaSala('jogo-iniciando', salaId, { salaId });
    console.log(`       game.js:    > Sala "${sala.nome}" iniciou. Aguardando ${sala.jogadoresEsperados} jogador(es).`);

    seedPontos(salaId);
    broadcastSalas();
}

// ---- Game ----

function adicionarJogador({ usuário, nome, salaId, gameId }) {
    const sala = salas[salaId];
    if (!sala || !sala.started) {
        server.enviar('logado', usuário, { gameId: null, args: process.argv.slice(2) });
        return;
    }

    if (!gameId) {
        const novoGameId = Math.random().toString(36).slice(-10);
        sala.tabuleiro.adicionarJogador({ id: novoGameId, nome });
        sala.clients[usuário.id] = novoGameId;
        socketEmSalaJogo[usuário.id] = salaId;
        usuário.join(salaId);
        server.enviar('logado', usuário, { gameId: novoGameId, args: process.argv.slice(2) });
        server.enviar('setup', usuário, {
            jogadores: sala.tabuleiro.exportarJogadores(),
            pontos: sala.tabuleiro.exportarPontos(),
        });
        sala.conectados.add(usuário.id);
    } else {
        if (!sala.tabuleiro.selecionarJogador(gameId)) {
            server.enviar('logado', usuário, { gameId: null, args: process.argv.slice(2) });
            return;
        }
        sala.clients[usuário.id] = gameId;
        socketEmSalaJogo[usuário.id] = salaId;
        usuário.join(salaId);
        clearTimeout(sala.timeouts[gameId]);
        delete sala.timeouts[gameId];
        server.enviar('logado', usuário, { gameId, args: process.argv.slice(2) });
        server.enviar('setup', usuário, {
            jogadores: sala.tabuleiro.exportarJogadores(),
            pontos: sala.tabuleiro.exportarPontos(),
        });
    }

    if (sala.conectados.size >= sala.jogadoresEsperados && !sala.timerStarted) {
        iniciarTemporizador(salaId);
    }
}

function moverJogador({ usuário, id, x, y }) {
    const salaId = socketEmSalaJogo[usuário.id];
    if (!salaId) return;
    const sala = salas[salaId];
    const jogador = sala.tabuleiro.jogadores[id];
    if (!jogador) return;
    jogador.transportar({ x, y });
    checarColisão(salaId, usuário, jogador);
    server.enviarParaSalaMenos('update', salaId, usuário, jogador);
}

function desconectou({ usuário }) {
    const salaLobbyId = socketEmSalaLobby[usuário.id];
    if (salaLobbyId) {
        _sairSalaLobby(usuário, salaLobbyId, false);
        broadcastSalas();
        return;
    }

    const salaJogoId = socketEmSalaJogo[usuário.id];
    if (!salaJogoId) return;
    const sala = salas[salaJogoId];
    if (!sala) return;

    const gameId = sala.clients[usuário.id];
    delete sala.clients[usuário.id];
    delete socketEmSalaJogo[usuário.id];
    if (!gameId) return;

    const timeout = setTimeout(() => {
        if (salas[salaJogoId] && sala.tabuleiro && sala.tabuleiro.jogadores[gameId]) {
            sala.tabuleiro.removerJogador(gameId);
        }
        delete sala.timeouts[gameId];
        if (Object.keys(sala.clients).length === 0) {
            if (sala.interval) clearInterval(sala.interval);
            delete salas[salaJogoId];
        }
    }, 20000);

    sala.timeouts[gameId] = timeout;
}

// ---- Tabuleiro observer callbacks ----

function comunicarNovoJogador(salaId, novoJogador) {
    server.enviarParaSala('add-player', salaId, novoJogador);
}

function comunicarNovoPonto(salaId, novoPonto) {
    const sala = salas[salaId];
    const tempos = { especial: 4000, explosivo: 6000 };
    if (novoPonto.tipo !== 'normal') {
        setTimeout(() => {
            if (salas[salaId] && sala.tabuleiro && sala.tabuleiro.pontos[novoPonto.id]) {
                sala.tabuleiro.removerPonto(sala.tabuleiro.pontos[novoPonto.id], true);
            }
        }, tempos[novoPonto.tipo]);
    }
    server.enviarParaSala('add-point', salaId, novoPonto);
}

function responderPontoRemovido(salaId, ponto) {
    const sala = salas[salaId];
    if (ponto.tipo === 'especial') sala.contador.especial = Math.ceil(4 + Math.random() * 6);
    if (ponto.tipo === 'explosivo') {
        if (ponto.autoremove) {
            for (const id in sala.tabuleiro.jogadores) sala.tabuleiro.jogadores[id].pontuar(-50);
            server.enviarParaSala('everyones-point', salaId, { ponto, pontuação: -50 });
        }
        sala.contador.bomba = Math.ceil(9 + Math.random() * 6);
    } else {
        sala.contador.especial--;
        sala.contador.bomba--;
    }
    server.enviarParaSala('remove-point', salaId, ponto);
    seedPontos(salaId);
}

function comunicarRemoçãoDeJogador(salaId, jogador) {
    server.enviarParaSala('remove-player', salaId, jogador.id);
}

// ---- Game logic ----

function checarColisão(salaId, usuário, jogador) {
    const sala = salas[salaId];
    for (const prop in sala.tabuleiro.pontos) {
        const ponto = sala.tabuleiro.pontos[prop];
        if (ponto.colidiu(jogador)) {
            const pontuação = ponto.tipo === 'especial' ? 50 : 10;
            jogador.pontuar(pontuação);
            server.enviar('my-point', usuário, { ponto, pontuação });
            server.enviarParaSalaMenos('someones-point', salaId, usuário, { id: jogador.id, pontuação });
            sala.tabuleiro.removerPonto(ponto);
        }
    }
}

function seedPontos(salaId) {
    const sala = salas[salaId];
    if (!sala || !sala.tabuleiro) return;
    setTimeout(() => {
        if (!salas[salaId] || !sala.tabuleiro) return;
        if (Object.keys(sala.tabuleiro.pontos).length < quantidadeDePontos) {
            if (sala.contador.especial <= 0) {
                sala.tabuleiro.adicionarPonto({ tipo: 'especial' });
                sala.contador.especial = 1000000;
            } else if (sala.contador.bomba <= 0) {
                sala.tabuleiro.adicionarPonto({ tipo: 'explosivo' });
                sala.contador.bomba = 1000000;
            } else {
                sala.tabuleiro.adicionarPonto({ tipo: 'normal' });
            }
            seedPontos(salaId);
        }
    }, Math.floor(1000 + Math.random() * 2000));
}

function iniciarTemporizador(salaId) {
    const sala = salas[salaId];
    if (sala.timerStarted) return;
    sala.timerStarted = true;

    let tempoRestante = process.argv.includes('test', 2) ? tempoDeTeste : tempoPadrão;

    const temporizador = () => {
        server.enviarParaSala('rodou-temporizador', salaId, tempoRestante);
        if (tempoRestante === 0) {
            gameOver(salaId);
            clearInterval(sala.interval);
        }
        tempoRestante--;
    };

    console.log(`       game.js:    > Sala "${sala.nome}" — timer iniciado.`);
    temporizador();
    sala.interval = setInterval(temporizador, 1000);
}

function gameOver(salaId) {
    const sala = salas[salaId];
    server.enviarParaSala('gameover', salaId, undefined);
    if (sala.tabuleiro) {
        for (const id in sala.tabuleiro.jogadores) sala.tabuleiro.jogadores[id].zerarPontuação();
    }
    console.log(`       game.js:    > Sala "${sala.nome}" — GAME OVER`);
    setTimeout(() => { delete salas[salaId]; }, 10000);
}
