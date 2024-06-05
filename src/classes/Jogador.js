class Jogador {

    constructor(id,usuário,posição){

        this.id = id;
        this.usuário = usuário;
        this.x = posição.x;
        this.y = posição.y;
        this.pontuação = 0;
        this.direcional = "";
    }

    mover(){

        switch(this.direcional){
            case '':
            break;
            case 'ArrowLeft':
                if(this.x > 1) this.x--;
            break;
            case 'ArrowRight':
                if(this.x < 20) this.x++;
            break;
            case 'ArrowUp':
                if(this.y > 1) this.y--;
            break;
            case 'ArrowDown':
                if(this.y < 20) this.y++;
            break;
        }
    }

    transportar(posição){

        this.x = posição.x;
        this.y = posição.y;        
    }

    pontuar(quantidade){

        this.pontuação = this.pontuação + quantidade;
    }

    atualizarPontuação(pontuação){

        this.pontuação = pontuação;
    }

    atualizarDirecional(direcional){

        this.direcional = direcional;
    }
}

module.exports = Jogador;