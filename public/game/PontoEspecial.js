class PontoEspecial extends Ponto{

    constructor(state,observers){

        super(state,observers);

        this.tipo = "especial";

        this.notifyAll("printar-ponto");
    }
}