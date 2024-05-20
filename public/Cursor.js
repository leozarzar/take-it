class Cursor extends Elemento{

    constructor(element,x,y,id){

        super(element);
        this.x = x;
        this.y = y;
        element.hidden = false;
        element.classList.add(`player${id}`)
        element.style.top = `${4+20*(y-1)}px`;
        element.style.left = `${4+20*(x-1)}px`;
    }

    mover(sentido){

        if(sentido === "direita" && this.x < this.xmax) this.x++;
        if(sentido === "esquerda" && this.x > 1) this.x--;
        if(sentido === "cima" && this.y > 1) this.y--;
        if(sentido === "baixo" && this.y < this.ymax) this.y++;
        this.update();
    }

    update(){
        this.element.style.top = `${4+20*(this.y-1)}px`;
        this.element.style.left = `${4+20*(this.x-1)}px`;
    }

}