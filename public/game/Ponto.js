class Ponto{

    constructor(state,observers){

        this.observers = observers;
        this.id = state.id;
        this.x = state.x;
        this.y = state.y;
        this.tipo = state.tipo;

        this.notifyAll("criou-ponto");
        console.log(`      Ponto.js:            > Criou um ponto com id "${this.id}" na posição (${this.x},${this.y}).`);
    }

    notifyAll(comando){

        for(const observer of this.observers) observer(comando,this);
    }

    atualizar(state){

        this.x = state.x;
        this.y = state.y;
        this.notifyAll("posicionou-ponto");
    }

    eliminar(autoremove){

        this.autoremove = autoremove;
        this.notifyAll("removeu-ponto");
        if(!autoremove) console.log(`      Ponto.js:            > O ponto "${this.id}" foi removido numa colisão.`);
        else console.log(`      Ponto.js:            > O ponto "${this.id}" foi autoremovido.`);
    }

    animarPontuação(pontuação){

        this.pontuação = pontuação;
        this.notifyAll("animar-ponto");
    }

    colidiu(jogador){

        return (this.x === jogador.x && this.y === jogador.y);
    }
}

export default Ponto;