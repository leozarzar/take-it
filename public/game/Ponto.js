class Ponto{

    constructor(state,ponto,updateCall,myList){

        
        this.x = state.x;
        this.y = state.y;
        this.especial = state.especial;
        if(state.especial && myList !== undefined){

            setTimeout(() => {

                myList.splice(myList.indexOf(this),1);
            },4000)
        }


        this.updateCall = updateCall;
        this.ponto = ponto;
        
        if(updateCall !== undefined && ponto !== undefined){

            this.update();
        }
    }

    mudar(state){

        this.x = state.x;
        this.y = state.y;
        this.especial = state.especial;
        if(state.especial) this.timer = 40;
        this.update();
    }

    update(){

        this.updateCall({ponto: this.ponto, especial: this.especial ,x: this.x, y: this.y})
    }

    eliminar(){

        this.ponto.remove();
    }

    setUpdate(updateCall){

        this.updateCall = updateCall;
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