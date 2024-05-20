let direcional = "";

document.addEventListener("keydown",(event) => {

    direcional = event.key;
    socketEnvia('direcional',direcional);
}, false);

document.addEventListener("keyup",(event) => {

    if(direcional === event.key){

        direcional = "";
        socketEnvia('direcional',direcional);
    }
}, false);