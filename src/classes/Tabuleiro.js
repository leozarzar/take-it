const Ponto = require("./Ponto.js");
const PontoEspecial = require("./PontoEspecial.js");

class Tabuleiro{

    constructor(callPrintar,callAdicionarPonto,callPrintarPonto,callRemoverPonto){

        this.pontos = [];
        this.jogadores = [];
        this.callPrintar = callPrintar;
        this.callAdicionarPonto = callAdicionarPonto;
        this.callPrintarPonto = callPrintarPonto;
        this.callRemoverPonto = callRemoverPonto;

        if(callPrintar !== undefined && callAdicionarPonto !== undefined && callPrintarPonto !== undefined){

            this.printar();
        }
    }

    printar(){

        this.callPrintar();
    }

    adicionarPonto(ponto,tipo){

        if(this.callPrintar !== undefined && this.callAdicionarPonto !== undefined && this.callPrintarPonto !== undefined){

            if(tipo === 'normal') this.pontos.push(new Ponto(ponto,this));
            if(tipo === 'especial') this.pontos.push(new PontoEspecial(ponto,this));
        }
        else {

            if(tipo === 'normal') this.pontos.push(new Ponto(ponto,this));
            if(tipo === 'especial') this.pontos.push(new PontoEspecial(ponto,this));
        }

        this.callAdicionarPonto({...ponto, tipo: tipo});
    }

    atualizarPonto(index,ponto){

        this.pontos[index].atualizar(ponto);
    }

    removerPonto(index){

        if(this.callPrintar !== undefined && this.callAdicionarPonto !== undefined && this.callPrintarPonto !== undefined) this.pontos[index].eliminar();
        this.pontos.splice(index,1);

        this.callRemoverPonto(index);
    }

    adicionarJogador(jogador){


    }
}

module.exports = Tabuleiro;