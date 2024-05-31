class Ponto{

    constructor(ponto){

        this.ponto = modeloPonto.cloneNode(true);
        this.colors = [];
        this.colors.push("#ffe240");
        this.colors.push("#ff5940");
        this.colors.push("#00f7ff");
        this.ponto.children[0].hidden = false;

        tabuleiro.appendChild(this.ponto);

        this.mover(ponto);
    }

    mover(ponto){

        this.x = ponto.x;
        this.y = ponto.y;
        if(ponto.especial) this.cor();
        else this.ponto.children[0].style.background = "#FFFFFF";
        this.update();
    }

    update(){
        
        this.ponto.style.width = `${pixel}px`;
        this.ponto.style.height = `${pixel}px`;
        this.ponto.style.top = `${margemTabuleiro+pixel*(this.y-1)}px`;
        this.ponto.style.left = `${margemTabuleiro+pixel*(this.x-1)}px`;
    }

    cor(){
        
        this.colors.push(this.colors.shift());
        this.ponto.children[0].style.background = this.colors[0];
    }

    eliminar(){

        this.ponto.remove();
    }
}