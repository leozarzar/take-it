class Ponto{

    constructor(state,observers){

        this.observers = observers;
        this.id = state.id;
        this.x = state.x;
        this.y = state.y;
        this.tipo = state.tipo;

        this.notifyAll("criou-ponto");
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
    }

    animarPontuação(pontuação){

        this.pontuação = pontuação;
        this.notifyAll("animar-ponto");
    }
}

export default Ponto;