const Ponto = require("./Ponto.js");
const PontoEspecial = require("./PontoEspecial.js");
const Jogador = require("./Jogador.js");

class Tabuleiro{

    constructor(callAdicionarPonto,callRemoverPonto,callAdicionarJogador,callRemoverJogador){

        this.pontos = [];
        this.jogadores = [];
        this.callAdicionarPonto = callAdicionarPonto;
        this.callRemoverPonto = callRemoverPonto;
        this.callAdicionarJogador = callAdicionarJogador;
        this.callRemoverJogador = callRemoverJogador;
    }

    atualizar(){

        this.jogadores.forEach( (jogador) => jogador.mover() );
    }

    adicionarPonto(tipo){

        const posição = this.sortear();

        if(tipo === 'normal') this.pontos.push(new Ponto(posição,this));
        if(tipo === 'especial') this.pontos.push(new PontoEspecial(posição,this));

        this.callAdicionarPonto({...posição, tipo: tipo});
    }

    removerPonto(index){

        const tipo = this.pontos[index].tipo;

        this.pontos.splice(index,1);

        this.callRemoverPonto(index,tipo);
    }

    adicionarJogador(id,usuário){

        if(!this.jogadores.some( (jogador) => (jogador.id === id) )){

            const posição = this.sortear();
    
            this.jogadores.push(new Jogador(id,usuário,posição));
    
            this.callAdicionarJogador({id: id, usuário: usuário, posição: posição});
        }
    }

    removerJogador(id){

        const index = this.jogadores.indexOf(this.encontrar(id));

        this.jogadores.splice(index,1);

        this.callRemoverJogador(index);
    }

    encontrar(id){

        return this.jogadores.find((jogador)=>(jogador.id === id));
    }

    sortear(){

        let x,y;
    
        x = Math.ceil(Math.random()*20);
        y = Math.ceil(Math.random()*20);

        const test = (each) => (each.x === x && each.y === y);

        return ( this.jogadores.some(test) || this.pontos.some(test) ) 
        ? this.sortear() 
        : {x: x, y: y};
    }

    exportarPontos(){

        return this.pontos.map( (ponto) => ({x: ponto.x, y: ponto.y, tipo: ponto.tipo}) );
    }

    exportarJogadores(){

        return this.jogadores.map( (jogador) => ({x: jogador.x, y: jogador.y, id: jogador.id, usuário: jogador.usuário, pontuação: jogador.pontuação}) );
    }
}

module.exports = Tabuleiro;