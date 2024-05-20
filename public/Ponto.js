class Ponto extends Elemento{

    constructor(element){

        super(element);
        this.x = Math.floor(Math.random() * 19 + 1);
        this.y = Math.floor(Math.random() * 19 + 1);
        element.style.top = `${4+20*(this.y-1)}px`;
        element.style.left = `${4+20*(this.x-1)}px`;
    }

    mover(x,y){

        this.x = x;
        this.y = y;
        this.element.style.top = `${4+20*(this.y-1)}px`;
        this.element.style.left = `${4+20*(this.x-1)}px`;
    }
}