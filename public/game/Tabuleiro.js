import Ponto from "./Ponto.js";
import Jogador from "./Jogador.js";

class Tabuleiro{

    constructor(observers){

        this.observers = observers;
        this.pontos = {};
        this.jogadores = {};

        this.notifyAll("criou-tabuleiro");
        console.log(`  Tabuleiro.js:        > Tabuleiro criado com sucesso.`);
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

        this.pontos[novoPonto.id] = new Ponto(novoPonto,this.observers);
        
        return novoPonto;
    }

    atualizarPonto(ponto){

        this.pontos[ponto.id].atualizar(ponto);
    }

    removerPonto(ponto,autoremove){

        this.pontos[ponto.id].eliminar(autoremove);
        delete this.pontos[ponto.id];
    }

    animarPontuação(id,pontuação){

        this.pontos[id].animarPontuação(pontuação);
    }

    adicionarJogador(jogador){

        const novoJogador = {
            ...jogador,
            meu: jogador.id === this.id ? true : false ,
            ...( (jogador.x === undefined || jogador.y === undefined)  ? this.sortear() : {x: jogador.x ,y: jogador.y}),
            pontuação: jogador.pontuação === undefined ? 0 : jogador.pontuação,
        };
        
        this.jogadores[jogador.id] = new Jogador(novoJogador, this.observers);

        this.notifyAll("jogador-adicionado");
    }

    atualizarJogador(jogador){

        if(this.id !== jogador.id){

            this.jogadores[jogador.id].transportar({x: jogador.x, y: jogador.y});
            this.jogadores[jogador.id].atualizarPontuação(jogador.pontuação);
        }

        this.notifyAll("moveu-jogador");
    }

    selecionarJogador(id){

        return this.jogadores[id];
    }

    moverJogador(direcional){

        this.jogadores[this.id].mover(direcional);

        this.notifyAll("moveu-jogador");
    }

    pontuarJogador(id,pontuação){

        this.jogadores[id].pontuar(pontuação);

        this.notifyAll("jogador-pontuou");
    }

    removerJogador(id){

        const dados = this.jogadores[id].eliminar();
        delete this.jogadores[id];
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