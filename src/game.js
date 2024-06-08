import io from "./server.js";
import Tabuleiro from "../public/game/Tabuleiro.js";
const contador = {tempo: 0, especial: 5, novoPonto: 0, bomba: 10};
const quantidadeDePontos = 6;

function game(comando,dados){

    const metodos = {

        'criou-ponto': enviarPonto,
        'removeu-ponto': removerPonto,
        'criou-jogador': enviarJogador,
        'removeu-jogador': removerJogador,
        'nova-conexão': removerJogador
    };

    if(metodos[comando] !== undefined) metodos[comando](dados);
    else console.log(`> "${comando}" não faz parte dos métodos implementados no game.`);
}

function enviarSetup(){

    server
    socket.emit('setup',{jogadores: tabuleiro.exportarJogadores(), pontos: tabuleiro.exportarPontos()});
}

function game(){
    
    const tabuleiro = new Tabuleiro();

    seedPontos();

    function enviarPonto(novoPonto){

        io.emit("add-point",novoPonto);
    }
    
    function removerPonto(index,tipo,timeout){
    
        if(tipo === "especial") contador.especial = Math.ceil(4+Math.random()*6);
        if(tipo === "explosivo"){

            if(timeout){

                tabuleiro.jogadores.forEach( (jogador) => {jogador.pontuar(-50)} );
                io.emit("everyones-point",{index: index, pontuação: -50});
            }
            contador.bomba = Math.ceil(9+Math.random()*6);
        }
        else{
            contador.especial--;
            contador.bomba--;
        }
        io.emit("remove-point",index);
        seedPontos();
    }

    function enviarJogador(novoJogador){

        io.emit("add-player",novoJogador);
    }

    function removerJogador(index){

        io.emit("remove-player",index);
    }

    function seedPontos(){

        setTimeout(() => {
            
            if(tabuleiro.pontos.length < quantidadeDePontos){
                
                if(contador.especial <=0){
                    
                    tabuleiro.adicionarPonto('especial');
                    contador.especial = 1000000;
                }
                else if(contador.bomba <=0){
                    
                    tabuleiro.adicionarPonto('explosivo');
                    contador.bomba = 1000000;
                }
                else tabuleiro.adicionarPonto('normal');

                seedPontos();
            }
        
        }, Math.floor(1000 + Math.random() * 2000) );
    }
}

function view(comando,dados){

    const metodos = {

        'printar-tabuleiro': printarTabuleiro,
        'criar-ponto': criarPonto,
        'printar-ponto': printarPonto,
        'animar-ponto': animarPonto,
        'criar-jogador': criarJogador,
        'printar-jogador': printarJogador,
        'criar-placar': criarPlacar,
        'printar-placar': printarPlacar,
        'ordenar-placar': ordenarPlacar
    };

    if(metodos[comando] !== undefined) metodos[comando](dados);
    else console.log(`> "${comando}" não faz parte dos métodos implementados.`);
}

module.exports = game;