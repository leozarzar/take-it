class Ponto extends Elemento{

    constructor(element){

        super(element);
        this.x = Math.floor(Math.random() * 19 + 1);
        this.y = Math.floor(Math.random() * 19 + 1);
        element.style.top = `${4+20*(this.y-1)}px`;
        element.style.left = `${4+20*(this.x-1)}px`;
    }

    troca(){

        this.x = Math.floor(Math.random() * 19 + 1);
        this.y = Math.floor(Math.random() * 19 + 1);
        this.element.style.top = `${4+20*(this.y-1)}px`;
        this.element.style.left = `${4+20*(this.x-1)}px`;
    }
}