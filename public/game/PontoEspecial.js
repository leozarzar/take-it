class PontoEspecial extends Ponto{

    constructor(state,tabuleiro){

        super(state,tabuleiro);

        this.tipo = "especial";

        this.interval = setInterval( () => {

            this.printar();
        },100)
    }

    eliminar(){

        super.eliminar();

        clearInterval(this.interval);
    }
}