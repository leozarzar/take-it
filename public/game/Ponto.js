class Ponto{

    constructor(state,ponto,callPrintar,tabuleiro){

        this.x = state.x;
        this.y = state.y;
        this.especial = state.especial;
        
        if(state.especial && tabuleiro !== undefined){

            setTimeout(() => {

                tabuleiro.pontos.splice(tabuleiro.pontos.indexOf(this),1);
                
            },4000)
        }


        this.callPrintar = callPrintar;
        this.ponto = ponto;
        
        if(callPrintar !== undefined && ponto !== undefined){

            this.printar();
        }
    }

    atualizar(state){

        this.x = state.x;
        this.y = state.y;
        this.especial = state.especial;
        if(state.especial) this.timer = 40;
        this.printar();
    }

    printar(){

        this.callPrintar({ponto: this.ponto, especial: this.especial ,x: this.x, y: this.y})
    }

    eliminar(){

        this.ponto.remove();
    }

    setUpdate(callPrintar){

        this.callPrintar = callPrintar;
    }

    setPonto(ponto){
        
        this.ponto = ponto;
    }

    intervalo(){

        if(this.timer !== undefined) this.timer--;
        if(this.timer === 0) return true;
        return false;
    }

    setElement(ponto,update){

        this.setPonto(ponto);
        this.setUpdate(update);
    }
}

module.exports = Ponto;