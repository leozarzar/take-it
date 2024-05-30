class Ponto{

    constructor(ponto,x,y){

        this.ponto = ponto;
        this.x = x;
        this.y = y;
        ponto.children[0].hidden = false;
        
        tabuleiro.appendChild(this.ponto);

        this.update();
    }

    mover(posição){

        this.x = posição.x;
        this.y = posição.y;
        this.update();
    }

    update(){
        
        this.ponto.style.width = `${pixel}px`;
        this.ponto.style.height = `${pixel}px`;
        this.ponto.style.top = `${margemTabuleiro+pixel*(this.y-1)}px`;
        this.ponto.style.left = `${margemTabuleiro+pixel*(this.x-1)}px`;
    }
}