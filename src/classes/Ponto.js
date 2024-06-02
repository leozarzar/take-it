class Ponto{

    constructor(state,tabuleiro){

        this.x = state.x;
        this.y = state.y;
        this.tipo = "normal";
        this.elemento = null;
        this.callPrintar = tabuleiro.callPrintarPonto === undefined ? null : tabuleiro.callPrintarPonto;
        
        if(this.elemento !== null){

            this.printar();
        }
    }

    atualizar(state){

        this.x = state.x;
        this.y = state.y;
        this.printar();
    }

    printar(){

        this.callPrintar(this)
    }

    eliminar(){

        this.elemento.remove();
    }

    setPrintar(callPrintar){

        this.callPrintar = callPrintar;
    }

    setElemento(elemento){
        
        this.elemento = elemento;
    }
}

module.exports = Ponto;