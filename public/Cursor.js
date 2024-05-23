class Cursor {

    constructor(id,itsMe,x,y){

        this.cursor = modeloCursor.cloneNode(true);
        this.cursor.hidden = false;
        this.cursor.classList.add(`player${id}`);
        if(itsMe) this.cursor.classList.add(`this-player-cursor`);
        this.mover(x,y);
        this.update();
        tabuleiro.appendChild(this.cursor);
    }

    mover(x,y){
    
        this.x = x;
        this.y = y;
        this.update();
    }

    update(){
        
        this.element.style.top = `${4+20*(this.y-1)}px`;
        this.element.style.left = `${4+20*(this.x-1)}px`;
    }
}