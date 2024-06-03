class Jogador {

    constructor(id,usuário,éMeu,tabuleiro){

        this.id = id;
        this.usuário = usuário;
        this.callPrintar = tabuleiro.callPrintarJogador === undefined ? null : tabuleiro.callPrintarJogador;
        this.callPrintarPontuação = tabuleiro.callPrintarPontuação === undefined ? null : tabuleiro.callPrintarPontuação;
        this.cursor = tabuleiro.callAdicionarJogador === undefined ? null : tabuleiro.callAdicionarJogador(id,éMeu);
        this.placar = tabuleiro.callAdicionarPlacar === undefined ? null : tabuleiro.callAdicionarPlacar(id,éMeu);

        this.mover({x: 0,y: 0});
        this.atualizarPontuação(0);
    }

    mover(posição){
    
        this.x = posição.x;
        this.y = posição.y;
        this.update();
    }

    update(){
        
        this.callPrintar(this);
    }

    atualizarPontuação(pontuação){

        this.pontuação = pontuação;

        this.callPrintarPontuação(this);
    }

    eliminar(){

        this.cursor.remove();
        this.placar.remove();
    }
}