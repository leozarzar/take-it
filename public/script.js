const tabuleiro = document.querySelector(".tabuleiro");
const input = document.querySelector('.nome-usuario');
const botão = document.querySelector('.botão');

const pixel = tabuleiro.width/20;

( async () => {

    const demo = await (await fetch("./demo")).json();
    const context = tabuleiro.getContext("2d");

    let i = 0;
    
    setInterval(() => {
    
        context.clearRect(0,0,tabuleiro.width,tabuleiro.height);
        context.fillStyle = "white";
        desenharCursor(context,demo[i].jogador);
        desenharPonto(context,demo[i].ponto);;
            
        if(i+1 === demo.length) i = 0;
        else i++;

    },100);
    
})();

function desenharCursor(context,posição){

    const raio = pixel/6;
    const padding = pixel/15;
    posição = {x: (posição.x-1)*pixel,y: (posição.y-1)*pixel}
    const A = {x: posição.x+raio+padding, y: posição.y+padding}
    const B = {x: posição.x+pixel-raio-padding, y: posição.y+padding}
    const C = {x: posição.x+pixel-raio-padding, y: posição.y+raio+padding}
    const D = {x: posição.x+pixel-padding, y: posição.y+pixel-raio-padding}
    const E = {x: posição.x+pixel-raio-padding, y: posição.y+pixel-raio-padding}
    const F = {x: posição.x+raio+padding, y: posição.y+pixel-padding}
    const G = {x: posição.x+raio+padding, y: posição.y+pixel-raio-padding}
    const H = {x: posição.x+padding, y: posição.y+raio+padding}
    const I = {x: posição.x+raio+padding, y: posição.y+raio+padding}

    context.beginPath();
    context.moveTo(A.x, A.y);
    context.lineTo(B.x, B.y);
    context.arc(C.x,C.y,raio,-Math.PI/2,0);
    context.lineTo(D.x,D.y);
    context.arc(E.x,E.y,raio,0,Math.PI/2);
    context.lineTo(F.x,F.y);
    context.arc(G.x,G.y,raio,Math.PI/2,Math.PI);
    context.lineTo(H.x,H.y);
    context.arc(I.x,I.y,raio,Math.PI,-Math.PI/2);
    context.fill()
}

function desenharPonto(context,posição){

    context.beginPath();
    context.arc((posição.x-1)*pixel+pixel/2,(posição.y-1)*pixel+pixel/2,pixel*0.5*0.5,0,Math.PI*2);
    context.fill();
}

input.addEventListener('input',(evt)=>{

    if(input.value !== '') botão.disabled = false;
    else botão.disabled = true;
});

botão.addEventListener('click', ()=>{

    sessionStorage.setItem('usuário',input.value);
    window.location.href = "/game/index.html";
});