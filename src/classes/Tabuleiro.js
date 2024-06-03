const Ponto = require("./Ponto.js");
const PontoEspecial = require("./PontoEspecial.js");

class Tabuleiro{

    constructor(callAdicionarPonto,callRemoverPonto){

        this.pontos = [];
        this.jogadores = [];
        this.callAdicionarPonto = callAdicionarPonto;
        this.callRemoverPonto = callRemoverPonto;
    }

    adicionarPonto(ponto,tipo){

        if(tipo === 'normal') this.pontos.push(new Ponto(ponto,this));
        if(tipo === 'especial') this.pontos.push(new PontoEspecial(ponto,this));

        this.callAdicionarPonto({...ponto, tipo: tipo});
    }

    removerPonto(index){

        const tipo = this.pontos[index].tipo;
        this.pontos.splice(index,1);
        this.callRemoverPonto(index,tipo);
    }
}

module.exports = Tabuleiro;