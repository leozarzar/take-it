class PontoEspecial extends Ponto{

    constructor(state,tabuleiro){

        super(state,tabuleiro);

        this.tipo = "especial";

        this.printar();
    }
}