class Tabuleiro{

    constructor(callPrintar,callAdicionarPonto,callPrintarPonto){

        this.pontos = [];
        this.jogadores = [];
        this.callPrintar = callPrintar;
        this.callAdicionarPonto = callAdicionarPonto;
        this.callPrintarPonto = callPrintarPonto;

        this.printar();
    }

    printar(){

        this.callPrintar();
    }

    adicionarPonto(ponto,tipo){

        const novoPonto = {...ponto, tipo: tipo};

        if(tipo === 'normal') this.pontos.push(new Ponto(ponto,this));
        if(tipo === 'especial') this.pontos.push(new PontoEspecial(ponto,this));
        
        return novoPonto;
    }

    atualizarPonto(index,ponto){

        this.pontos[index].atualizar(ponto);
    }

    removerPonto(index){

        this.pontos[index].eliminar();
        this.pontos.splice(index,1);
    }

    adicionarJogador(jogador,id){

        this.jogadores.push(new Jogador(jogador.id, jogador.usuário, jogador.id === id ? true : false));
    }

    atualizarJogador(jogador,index){

        this.jogadores[index].mover({x: jogador.x, y: jogador.y});
        this.jogadores[index].atualizarPontuação(jogador.pontuação);
    }

    removerJogador(index){

        this.jogadores[index].eliminar();
        this.jogadores.splice(index,1);
    }
}