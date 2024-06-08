import Ponto from "./Ponto.js";
import Jogador from "./Jogador.js";

class Tabuleiro{

    constructor(observers,id){

        this.observers = observers;
        this.id = id;
        this.pontos = {};
        this.jogadores = {};

        this.notifyAll("criou-tabuleiro");
    }

    notifyAll(comando){

        for(const observer of this.observers) observer(comando,this);
    }

    adicionarPonto(ponto,tipo){

        const novoPonto = {
            ...ponto,
            tipo: tipo
        };

        this.pontos[ponto.id] = new Ponto(ponto,this.observers);
        
        return novoPonto;
    }

    atualizarPonto(ponto){

        this.pontos[ponto.id].atualizar(ponto);
    }

    removerPonto(id){

        this.pontos[id].eliminar();
        delete this.pontos[id];
    }

    animarPontuação(id,pontuação){

        this.pontos[id].animarPontuação(pontuação);
    }

    adicionarJogador(jogador){

        const novoJogador = {
            ...jogador,
            meu: jogador.id === this.id ? true : false
        };
        
        this.jogadores[jogador.id] = new Jogador(novoJogador, this.observers);

        console.log(`> Usuário Adicionado: ${jogador.usuário} - ${jogador.id}`);
    }

    atualizarJogador(jogador){

        if(this.jogadorLocal.id !== jogador.id){

            this.jogadores[id].transportar({x: jogador.x, y: jogador.y});
            this.jogadores[id].atualizarPontuação(jogador.pontuação);
        }
    }

    selecionarJogador(id){

        return this.jogadores[id];
    }

    moverJogador(direcional){

        this.jogadores[this.id].mover(direcional);
    }

    removerJogador(id){

        const dados = this.jogadores[id].eliminar();
        delete this.jogadores[id];
        
        console.log(`> Usuário Removido: ${dados.usuário} - ${dados.id}`);
    }
}

export default Tabuleiro;