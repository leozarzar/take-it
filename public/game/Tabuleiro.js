import Ponto from "./Ponto.js";
import Jogador from "./Jogador.js";

class Tabuleiro{

    constructor(observers){

        this.observers = observers;
        this.pontos = {};
        this.jogadores = {};

        this.notifyAll("criou-tabuleiro");
    }

    notifyAll(comando){

        for(const observer of this.observers) observer(comando,this);
    }

    atualizarId(id){

        this.id = id;
    }

    adicionarPonto(ponto){

        const novoPonto = {
            ...ponto,
            ...( (ponto.x === undefined || ponto.y === undefined)  ? this.sortear() : {x: ponto.x ,y: ponto.y}),
            ...( ponto.id === undefined  ? {id: Math.random().toString(36).slice(-10)} : {id: ponto.id}),
        };

        this.pontos[ponto.id] = new Ponto(ponto,this.observers);
        
        return novoPonto;
    }

    atualizarPonto(ponto){

        this.pontos[ponto.id].atualizar(ponto);
    }

    removerPonto(id){

        this.pontos[id].eliminar();
        delete this.pontos[id];
    }

    animarPontuação(id,pontuação){

        this.pontos[id].animarPontuação(pontuação);
    }

    adicionarJogador(jogador){

        console.log(this);
        const novoJogador = {
            ...jogador,
            meu: jogador.id === this.id ? true : false ,
            ...( (jogador.x === undefined || jogador.y === undefined)  ? this.sortear() : {x: jogador.x ,y: jogador.y})
        };
        
        this.jogadores[jogador.id] = new Jogador(novoJogador, this.observers);

        console.log(`Tabuleiro.js > ${jogador.id} com nome de usuário "${jogador.nome}".`);
    }

    atualizarJogador(jogador){

        if(this.jogadorLocal.id !== jogador.id){

            this.jogadores[id].transportar({x: jogador.x, y: jogador.y});
            this.jogadores[id].atualizarPontuação(jogador.pontuação);
        }
    }

    selecionarJogador(id){

        return this.jogadores[id];
    }

    moverJogador(direcional){

        this.jogadores[this.id].mover(direcional);
    }

    removerJogador(id){

        const dados = this.jogadores[id].eliminar();
        delete this.jogadores[id];
        
        console.log(`> Usuário Removido: ${dados.usuário} - ${dados.id}`);
    }

    exportarPontos(){

        return this.pontos;
    }

    exportarJogadores(){

        return this.jogadores;
    }

    sortear(){

        let x,y;
    
        x = Math.ceil(Math.random()*20);
        y = Math.ceil(Math.random()*20);

        const valoresJogadores = Object.values(this.jogadores);

        const test = (each) => (each.x === x && each.y === y);

        return ( valoresJogadores.some(test) || valoresJogadores.some(test) ) 
        ? this.sortear() 
        : {x: x, y: y};
    }
}

export default Tabuleiro;