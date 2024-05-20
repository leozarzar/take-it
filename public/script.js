const tabuleiro = document.querySelector(".tabuleiro");
const elementoPontuação = document.querySelector(".pontuação");

let pontuação = 0;

elementoPontuação.innerHTML = `Score: ${pontuação}`;
const cursor = new Cursor(document.querySelector(".cursor"),2,2);
const ponto = new Ponto(document.querySelector(".ponto"));

checarControle();

setInterval(() => {
    
    checarControle();

    if(cursor.x === ponto.x && cursor.y === ponto.y){

        pontuação++;
        elementoPontuação.innerHTML = `Score: ${pontuação}`;
        ponto.troca();
    }

},80);
