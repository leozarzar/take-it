class PontoExplosivo extends Ponto{

    constructor(state,tabuleiro){

        super(state,tabuleiro);

        this.tipo = "explosivo";

        this.interval = setInterval( () => {

            this.printar();
        },500)
    }

    eliminar(){

        super.eliminar();

        clearInterval(this.interval);
    }
}