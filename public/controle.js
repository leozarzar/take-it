let direcional = "";
//let gravar = false;
//const dados = [];

document.addEventListener("keydown",(event) => {

    direcional = event.key;
    socketEnvia('direcional',direcional);

    /*if(direcional === 'g'){

        if(gravar === false) gravar = true;
        else{

            gravar = false;
            socketEnvia('write',dados);
            console.log(dados);
            dados.length = 0;
            console.log(dados);
        }
    }*/
}, false);

document.addEventListener("keyup",(event) => {

    if(direcional === event.key){

        direcional = "";
        socketEnvia('direcional',direcional);
    }
}, false);