const Ponto = require("./Ponto.js");

class PontoEspecial extends Ponto{

    constructor(state,tabuleiro){

        super(state,tabuleiro);

        this.tipo = "especial";

        setTimeout(() => {
    
            const index = tabuleiro.pontos.indexOf(this);
            if(index > -1) tabuleiro.removerPonto(index);

        },4000)
    }
}

module.exports = PontoEspecial;