document.querySelector(".touch-cima").addEventListener('touchstart', touchCima, false);
document.querySelector(".touch-baixo").addEventListener('touchstart', touchBaixo, false);
document.querySelector(".touch-esquerda").addEventListener('touchstart', touchEsquerda, false);
document.querySelector(".touch-direita").addEventListener('touchstart', touchDireita, false);
                                                                        
function touchCima() {
 
    direcional = "ArrowUp";
    socketEnvia('direcional',direcional);                              
};  

function touchBaixo() {
 
    direcional = "ArrowDown";
    socketEnvia('direcional',direcional);                                
};  

function touchEsquerda() {
 
    direcional = "ArrowLeft";
    socketEnvia('direcional',direcional);                                
};  

function touchDireita() {
 
    direcional = "ArrowRight";
    socketEnvia('direcional',direcional);                                
};  