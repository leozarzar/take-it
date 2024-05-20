let cima = false;
let baixo = false;
let esquerda = false;
let direita = false;

document.addEventListener("keydown",(event) => {

    reset();

    if(event.key === "ArrowUp") cima = true;
    if(event.key === "ArrowDown") baixo = true;
    if(event.key === "ArrowLeft") esquerda = true;
    if(event.key === "ArrowRight") direita = true;

}, false);

document.addEventListener("keyup",(event) => {

    if(event.key === "ArrowUp") cima = false;
    if(event.key === "ArrowDown") baixo = false;
    if(event.key === "ArrowLeft") esquerda = false;
    if(event.key === "ArrowRight") direita = false;

}, false);

const checarControle = () => {

    if(cima) cursor.mover('cima');
    if(baixo) cursor.mover('baixo');
    if(esquerda) cursor.mover('esquerda');
    if(direita) cursor.mover('direita');
}

const reset = () => {

    cima = false;
    baixo = false;
    esquerda = false;
    direita = false;
}
