class Ponto{

    constructor(state,tabuleiro){

        this.x = state.x;
        this.y = state.y;
        this.tipo = "normal";
        this.tabuleiro = tabuleiro;
    }

    atualizar(state){

        this.x = state.x;
        this.y = state.y;
    }

    colidiu(){

        return this.tabuleiro.jogadores.filter( (jogador) => (this.x === jogador.x && this.y === jogador.y) );
    }
}

module.exports = Ponto;