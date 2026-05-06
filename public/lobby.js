function initLobby(nome) {
    const socket = io.connect(window.location.origin);

    // UI
    const secaoLobby    = document.getElementById('secao-lobby');
    const secaoSala     = document.getElementById('secao-sala');
    const listaSalas    = document.getElementById('lista-salas');
    const nomeSalaTit   = document.getElementById('nome-sala-titulo');
    const aguardandoMsg = document.getElementById('aguardando-msg');
    const listaJogs     = document.getElementById('lista-jogadores');
    const btnPronto     = document.getElementById('btn-pronto');
    const btnSair       = document.getElementById('btn-sair');
    const btnCriar      = document.getElementById('btn-criar-sala');
    const inputNome     = document.getElementById('input-nome-sala');

    let salaAtual = null;
    let estouPronto = false;

    // ---- Socket events ----

    socket.on('connect', () => {
        socket.emit('listar-salas');
    });

    socket.on('salas-atualizadas', (salas) => {
        if (salaAtual) return;
        listaSalas.innerHTML = '';
        const disponiveis = salas.filter(s => !s.started);
        if (disponiveis.length === 0) {
            listaSalas.innerHTML = '<li class="empty-msg">Nenhuma sala disponível</li>';
            return;
        }
        disponiveis.forEach(sala => {
            const qtd = Object.keys(sala.membros).length;
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${sala.nome} &mdash; ${qtd} ${qtd === 1 ? 'jogador' : 'jogadores'}</span>
                <button class="btn-entrar">Entrar</button>
            `;
            li.querySelector('.btn-entrar').addEventListener('click', () => entrarSala(sala.id));
            listaSalas.appendChild(li);
        });
    });

    socket.on('entrou-sala', (sala) => {
        salaAtual = sala;
        estouPronto = false;
        btnPronto.textContent = 'Pronto';
        btnPronto.classList.remove('ativo');
        secaoLobby.hidden = true;
        secaoSala.hidden = false;
        renderizarSala(sala);
    });

    socket.on('sala-atualizada', (sala) => {
        salaAtual = sala;
        renderizarSala(sala);
    });

    socket.on('jogo-iniciando', ({ salaId }) => {
        sessionStorage.setItem('sala-id', salaId);
        window.location.href = '/game/index.html';
    });

    // ---- Actions ----

    function criarSala() {
        const nomeSala = inputNome.value.trim();
        if (!nomeSala) return;
        socket.emit('criar-sala', { nomeSala, nome });
        inputNome.value = '';
    }

    function entrarSala(salaId) {
        socket.emit('entrar-sala', { salaId, nome });
    }

    function sairSala() {
        socket.emit('sair-sala');
        salaAtual = null;
        estouPronto = false;
        secaoSala.hidden = true;
        secaoLobby.hidden = false;
        socket.emit('listar-salas');
    }

    function togglePronto() {
        estouPronto = !estouPronto;
        if (estouPronto) {
            socket.emit('pronto');
            btnPronto.textContent = 'Cancelar';
            btnPronto.classList.add('ativo');
        } else {
            socket.emit('cancelar-pronto');
            btnPronto.textContent = 'Pronto';
            btnPronto.classList.remove('ativo');
        }
    }

    function renderizarSala(sala) {
        nomeSalaTit.textContent = sala.nome;
        const qtd = Object.keys(sala.membros).length;
        const prontos = sala.prontos.length;
        aguardandoMsg.textContent = `${prontos} de ${qtd} pronto${prontos !== 1 ? 's' : ''}`;

        listaJogs.innerHTML = '';
        Object.values(sala.membros).forEach(membro => {
            const pronto = sala.prontos.includes(membro.socketId);
            const li = document.createElement('li');
            li.textContent = membro.nome;
            if (pronto) {
                const badge = document.createElement('span');
                badge.className = 'pronto-badge';
                badge.textContent = '✓ Pronto';
                li.appendChild(badge);
            }
            listaJogs.appendChild(li);
        });
    }

    // ---- Listeners ----

    btnCriar.addEventListener('click', criarSala);
    btnPronto.addEventListener('click', togglePronto);
    btnSair.addEventListener('click', sairSala);
    inputNome.addEventListener('keyup', (e) => { if (e.key === 'Enter') criarSala(); });
}
