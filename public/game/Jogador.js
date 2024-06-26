class Jogador {

    constructor(state,observers){

        this.observers = observers;
        this.id = state.id;
        this.nome = state.nome;
        this.meu = state.meu;
        this.x = state.x;
        this.y = state.y;
        this.pontuação = state.pontuação;

        this.notifyAll("criou-jogador");
        console.log(`    Jogador.js:            > Criou um jogador com id "${this.id}" e nome "${this.nome}" na posição (${this.x},${this.y}).`);
    }

    notifyAll(comando){

        for(const observer of this.observers) observer(comando,this);
    }

    transportar(posição){
    
        this.notifyAll("posicionando-jogador");

        this.x = posição.x;
        this.y = posição.y;
        
        this.notifyAll("posicionou-jogador");
    }

    mover(direcional){

        this.notifyAll("posicionando-jogador");

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
        if(this.pontuação < 0) this.pontuação = 0;

        this.notifyAll("pontuou-jogador");
    }

    zerarPontuação(){

        this.pontuação = 0;

        this.notifyAll("pontuou-jogador");
    }

    eliminar(){

        this.notifyAll("removeu-jogador");
        console.log(`    Jogador.js:            > Removeu jogador "${this.id}" com nome "${this.nome}"`);
        
        return {usuário: this.usuário, id: this.id};
    }
}

export default Jogador;