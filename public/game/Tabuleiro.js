class Tabuleiro{

    constructor(observers){

        this.pontos = {};
        this.jogadores = [];
        this.observers = observers;

        this.notifyAll("printar-tabuleiro");
    }

    notifyAll(comando){

        for(const observer of this.observers) observer(comando,this);
    }

    adicionarPonto(ponto,tipo){

        const novoPonto = {...ponto, tipo: tipo};

        this.pontos[ponto.id] = new Ponto(ponto,this.observers);
        
        return novoPonto;
    }

    atualizarPonto(ponto){

        this.pontos[ponto.id].atualizar(ponto);
    }

    removerPonto(ponto){

        this.pontos[ponto.id].eliminar();
        delete this.pontos[ponto.id];
    }

    animarPontuação(ponto,pontuação){

        this.pontos[ponto.id].animarPontuação(pontuação);
    }

    adicionarJogador(jogador,id){

        const novoJogador = new Jogador(jogador.id, jogador.usuário, jogador.id === id ? true : false, jogador.posição, this.observers);
        this.jogadores.push(novoJogador);
        return novoJogador;
    }

    atualizarJogador(jogador){

        if(this.jogadorLocal.id !== jogador.id){

            const index = this.jogadores.findIndex( (jog) => (jog.id === jogador.id) );
            this.jogadores[index].transportar({x: jogador.x, y: jogador.y});
            this.jogadores[index].atualizarPontuação(jogador.pontuação);
        }
    }

    selecionarJogadorLocal(jogador){

        this.jogadorLocal = jogador;
    }

    moverJogador(direcional){

        this.jogadorLocal.mover(direcional);
    }

    encontrar(id){

        return this.jogadores.find((jogador)=>(jogador.id === id));
    }

    removerJogador(index){

        this.jogadores[index].eliminar();
        this.jogadores.splice(index,1);
    }
}