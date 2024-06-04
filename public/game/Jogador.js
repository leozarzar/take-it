class Jogador {

    constructor(id,usuário,éMeu,posição,tabuleiro){

        this.id = id;
        this.usuário = usuário;
        this.callPrintar = tabuleiro.callPrintarJogador === undefined ? null : tabuleiro.callPrintarJogador;
        this.callPrintarPontuação = tabuleiro.callPrintarPontuação === undefined ? null : tabuleiro.callPrintarPontuação;
        this.cursor = tabuleiro.callAdicionarJogador === undefined ? null : tabuleiro.callAdicionarJogador(id,éMeu);
        this.placar = tabuleiro.callAdicionarPlacar === undefined ? null : tabuleiro.callAdicionarPlacar(id,éMeu);

        this.transportar(posição);
        this.atualizarPontuação(0);
    }

    transportar(posição){
    
        this.x = posição.x;
        this.y = posição.y;
        this.update();
    }

    mover(direcional){

        switch(direcional){
            case '':
            break;
            case 'ArrowLeft':
                if(this.x > 1) this.x--;
            break;
            case 'ArrowRight':
                if(this.x < 20) this.x++;
            break;
            case 'ArrowUp':
                if(this.y > 1) this.y--;
            break;
            case 'ArrowDown':
                if(this.y < 20) this.y++;
            break;
        }

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