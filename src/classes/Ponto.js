class Ponto{

    constructor(state,tabuleiro){

        this.x = state.x;
        this.y = state.y;
        this.tipo = "normal";
    }

    atualizar(state){

        this.x = state.x;
        this.y = state.y;
    }
}

module.exports = Ponto;