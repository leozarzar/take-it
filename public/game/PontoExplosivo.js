class PontoExplosivo extends Ponto{

    constructor(state,tabuleiro){

        super(state,tabuleiro);

        this.tipo = "explosivo";

        this.printar();
    }
}