class Ponto{

    constructor(ponto,posição){

        this.ponto = ponto;
        this.x = posição.x;
        this.y = posição.y;
        this.colors = [];
        this.colors.push("#ffe240");
        this.colors.push("#ff5940");
        this.colors.push("#00f7ff");
        this.ponto.children[0].hidden = false;

        tabuleiro.appendChild(this.ponto);

        this.update();
    }

    mover(posição){

        this.x = posição.x;
        this.y = posição.y;
        this.cor();
        this.update();
    }

    update(){
        
        this.ponto.style.width = `${pixel}px`;
        this.ponto.style.height = `${pixel}px`;
        this.ponto.style.top = `${margemTabuleiro+pixel*(this.y-1)}px`;
        this.ponto.style.left = `${margemTabuleiro+pixel*(this.x-1)}px`;
        this.ponto.children[0].style.background = this.colors[0];
    }

    cor(){

        this.colors.push(this.colors.shift());
    }

    eliminar(){

        this.ponto.remove();
    }
}