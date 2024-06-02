const Ponto = require("./Ponto.js");

class PontoEspecial extends Ponto{

    constructor(state,tabuleiro){

        super(state,tabuleiro);

        this.tipo = "especial";

        setTimeout(() => {
    
            const index = tabuleiro.pontos.indexOf(this);
            tabuleiro.removerPonto(index);

        },4000)

        if(this.elemento !== null){

            setInterval( () => {

                this.printar();
            },100)
        }
    }
}

module.exports = PontoEspecial;