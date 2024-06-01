class Tabuleiro{

    constructor(callPrintar,callAdicionarPonto,callPrintarPonto){

        this.pontos = [];
        this.jogadores = [];
        this.callPrintar = callPrintar;
        this.callAdicionarPonto = callAdicionarPonto;
        this.callPrintarPonto = callPrintarPonto;

        if(callPrintar !== undefined && callAdicionarPonto !== undefined && callPrintarPonto !== undefined){

            this.printar();
        }
    }

    printar(){

        this.callPrintar();
    }

    adicionarPonto(ponto){

        this.pontos.push(new Ponto(ponto,this.callAdicionarPonto(),this.callPrintarPonto,this));
    }

    atualizarPonto(index,ponto){

        this.pontos[index].atualizar(ponto);
    }

    removerPonto(index){

        this.pontos[index].eliminar();
        this.pontos.shift();
    }

    adicionarJogador(jogador){


    }
}

module.exports = Tabuleiro;