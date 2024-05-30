
printarTabuleiro();

( async () => {

    const demo = await (await fetch("./demo")).json();
    
    const jogador = new Jogador("", true,demo[0].jogador.x,demo[0].jogador.y);
    const ponto = new Ponto(modeloPonto.cloneNode(true),demo[0].jogador.x,demo[0].jogador.y);
    
    let i = 0;
    
    setInterval(() => {
    
        jogador.mover(demo[i].jogador);
        ponto.mover(demo[i].ponto);
        if(i+1 === demo.length) i = 0;
        else i++;
    },100);
    
    window.addEventListener('resize', () => {
    
        printarTabuleiro();
    })
})();
