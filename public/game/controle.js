let direcional = ["","",""];

let gameInterval;

function run(move){

    gameInterval = setInterval(() => {
        
        move(direcional[1]);
        direcional.shift()
        direcional.push(direcional[1]);

    },100);

    document.addEventListener("keydown",(event) => {

        if(!event.repeat){

            direcional[1] = event.key;
            direcional[2] = event.key;
        }

    }, false);
    
    document.addEventListener("keyup",(event) => {
    
        if(direcional[1] === event.key){
            
            if(direcional[0] !== direcional[1]){

                direcional[2] = "";
            }
            else{

                direcional[1] = "";
                direcional[2] = "";
            }
        }
    
    }, false);
}

function shutdown(){

    clearInterval(gameInterval);
}

export default {
    run: run,
    shutdown: shutdown
};