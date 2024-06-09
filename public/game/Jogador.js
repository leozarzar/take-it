class Jogador {

    constructor(state,observers){

        this.observers = observers;
        this.id = state.id;
        this.nome = state.nome;
        this.meu = state.meu;
        this.x = state.x;
        this.y = state.y;
        this.pontuação = 0;

        this.notifyAll("criou-jogador");
    }

    notifyAll(comando){

        for(const observer of this.observers) observer(comando,this);
    }

    transportar(posição){
    
        this.x = posição.x;
        this.y = posição.y;
        this.notifyAll("posicionou-jogador");
    }

    mover(direcional){

        switch(direcional){
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

        this.notifyAll("posicionou-jogador");
    }

    atualizarPontuação(pontuação){

        this.pontuação = pontuação;

        this.notifyAll("pontuou-jogador");
    }

    pontuar(pontos){

        this.pontuação = this.pontuação + pontos;

        this.notifyAll("pontuou-jogador");
    }

    eliminar(){

        this.notifyAll("removeu-jogador");
        
        return {usuário: this.usuário, id: this.id};
    }
}

export default Jogador;