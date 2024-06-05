const Ponto = require("./Ponto.js");

class PontoExplosivo extends Ponto{

    constructor(state,tabuleiro){

        super(state,tabuleiro);

        this.tipo = "explosivo";

        setTimeout(() => {
    
            const index = tabuleiro.pontos.indexOf(this);
            if(index > -1) tabuleiro.removerPonto(index,true);

        },6000)
    }
}

module.exports = PontoExplosivo;