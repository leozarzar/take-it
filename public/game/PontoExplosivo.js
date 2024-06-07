class PontoExplosivo extends Ponto{

    constructor(state,observers){

        super(state,observers);

        this.tipo = "explosivo";

        this.notifyAll("printar-ponto");
    }
}