class Ponto{

    constructor(state,observers){

        this.id = state.id;
        //Math.random().toString(36).slice(-10);
        this.x = state.x;
        this.y = state.y;
        this.tipo = state.tipo;

        this.notifyAll("criar-ponto");
        this.notifyAll("printar-ponto");
    }

    notifyAll(comando){

        for(const observer of this.observers) observer(comando,this);
    }

    atualizar(state){

        this.x = state.x;
        this.y = state.y;
        this.notifyAll("printar-ponto");
    }

    eliminar(){

        this.notifyAll("remover-ponto");
    }

    animarPontuação(pontuação){

        this.pontuação = pontuação;
        this.notifyAll("animar-ponto");
    }
}