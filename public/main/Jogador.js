let pixel;

class Jogador {

    constructor(id,éMeu,x,y){

        this.id = id;

        this.cursor = modeloCursor.cloneNode(true);
        this.cursor.hidden = false;
        this.cursor.classList.add(`cursor${id}`);
        if(éMeu) this.cursor.classList.add(`meu-cursor`);
        
        tabuleiro.appendChild(this.cursor);

        this.mover({x: x,y: y});
        this.atualizarPontuação(0);
    }

    mover(posição){
    
        this.x = posição.x;
        this.y = posição.y;
        this.update();
    }

    update(){
        
        this.cursor.style.width = `${pixel}px`;
        this.cursor.style.height = `${pixel}px`;
        this.cursor.style.top = `${margemTabuleiro+pixel*(this.y-1)}px`;
        this.cursor.style.left = `${margemTabuleiro+pixel*(this.x-1)}px`;
    }

    pontuar(){

        this.pontuação++;
    }

    atualizarPontuação(pontuação){

        this.pontuação = pontuação;
    }

    eliminar(){

        this.cursor.remove();
    }
}