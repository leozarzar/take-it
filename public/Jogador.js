let pixel;

class Jogador {

    constructor(id,éMeu){

        this.id = id;

        this.cursor = modeloCursor.cloneNode(true);
        this.cursor.hidden = false;
        this.cursor.classList.add(`cursor${id}`);
        if(éMeu) this.cursor.classList.add(`meu-cursor`);

        this.placar = modeloPlacar.cloneNode(true);
        this.placar.hidden = false;
        this.placar.classList.add(`placar${id}`);
        if(éMeu) this.placar.classList.add(`meu-placar`);
        
        tabuleiro.appendChild(this.cursor);
        placarGeral.appendChild(this.placar);

        this.mover({x: 0,y: 0});
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
        this.placar.innerHTML = `${this.id} - ${this.pontuação}`;
    }

    atualizarPontuação(pontuação){

        this.pontuação = pontuação;
        this.placar.innerHTML = `${this.id} - ${this.pontuação}`;
    }

    eliminar(){

        this.cursor.remove();
        this.placar.remove();
    }
}