
class Game{

    constructor({ observers }){

        this.observers = observers;

        this.jogadores = {};
        this.pontos = {};
        this.contador = {
            pontos: 0,
            pontosEspeciais: Math.ceil(4+Math.random()*6),
            pontosBomba: 0,
            pontosVida: 0,
        }

        this.networkEventHandler = {
            'settings': this.run.bind(this),
            'novo-jogador': this.adicionarJogador.bind(this),
            'movimentação': this.moverJogador.bind(this),
            'desconectou': this.removerJogador.bind(this),
        }
    }

    newEvent(event,data){
        this.observers.forEach((observer) => observer.handle(event,data));
    }

    handle(event,data){
        this.networkEventHandler[event](data);
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

    run(settings){

        console.log(settings);
        this.settings = settings;
        const { duração, id } = settings;

        this.seedPontos();

        let restante = duração;

        const clockInterval = setInterval(() => {

            this.newEvent('relógio',restante);
            restante--;

        },1000);

        setTimeout(() => {

            clearInterval(clockInterval);
            console.log(id);
            this.newEvent('gameover',{ end: id });

        }, duração*1000);
    }

    seedPontos(){

        const { quantidadeDePontos, modo, especiais } = this.settings;

        setTimeout(() => {
        
            if(Object.keys(this.pontos).length < quantidadeDePontos){
    
                console.log(this.contador)
                if(this.contador.pontosEspeciais <= 0 && especiais){
                    
                    this.adicionarPonto({tipo: 'especial'});
                    this.contador.pontosEspeciais = 100000;
                }
                else if(this.contador.pontosBomba <= 0 && modo === 'Sobrevivência'){
                    
                    this.adicionarPonto({tipo: 'bomba'});
                    this.contador.pontosBomba = Math.ceil(9+Math.random()*6);
                }
                else if(this.contador.pontosVida <= 0 && modo === 'Sobrevivência'){
                    
                    this.adicionarPonto({tipo: 'vida'});
                    this.contador.pontosVida = Math.ceil(9+Math.random()*6);
                }
                else{
                    this.adicionarPonto({tipo: 'normal'});
                    this.contador.pontosEspeciais--;
                    this.contador.pontosBomba--;
                    this.contador.pontosVida--;
                }
    
                this.seedPontos();
            }
        
        }, Math.floor(1000 + Math.random() * 2000) );

    }

    adicionarJogador({ id, nome }){

        this.jogadores[id] = {
            id,
            nome,
            posição: this.sortear(),
            pontuação: 0,
            vida: 5,
        }

        this.newEvent('você-foi-adicionado',{ to: id, id: id, posição: this.jogadores[id].posição, jogadores: this.jogadores, pontos: this.pontos});
    }

    moverJogador({ id, posição }){
        
        this.jogadores[id] = {
            ...this.jogadores[id],
            posição,
        }

        this.checarColisão({ id });

        this.newEvent('mudou-algum-jogador',{ except: id, jogadores: this.jogadores });
    }

    removerJogador({ id }){
        
        delete this.jogadores[id];
        
        this.newEvent('mudou-algum-jogador',{ jogadores: this.jogadores[id] });
    }

    adicionarPonto({ tipo }){

        const id = Math.random().toString(36).slice(-10);
        
        this.pontos[id] = {
            id,
            tipo,
            posição: this.sortear(),
        }

        if(tipo === "especial"){
        
            setTimeout( () => {
                
                this.removerPonto({ id });

            }, 10000);
        }
        else if(tipo === "bomba"){
    
            setTimeOut( () => {
                
                this.removerPonto(id);
                this.newEvent('atualizar-vida',{ ajusteVida: -1 });

            }, 10000);
        }

        this.newEvent('criou-ponto',{ ponto: this.pontos[id] });
    }

    removerPonto({ id }){
        
        if(this.pontos[id]){
            this.newEvent('removeu-ponto',{ ponto: this.pontos[id] });
        
            if(this.pontos[id].tipo === 'especial') this.contador.pontosEspeciais = Math.ceil(4+Math.random()*6);

            delete this.pontos[id];

            this.seedPontos();
        }
    }

    checarColisão({ id }){

        for(const ponto in this.pontos){
    
            if(this.pontos[ponto].posição.x === this.jogadores[id].posição.x && this.pontos[ponto].posição.y === this.jogadores[id].posição.y){
                const ajustePontuação = this.pontos[ponto].tipo === "especial" ? 50 : this.pontos[ponto].tipo === "normal" || this.pontos[ponto].tipo === "bomba" ? 10 : 0;
                if(ajustePontuação !== 0) this.newEvent('atualizar-pontuação',{ ajustePontuação });
                else if(this.pontos[ponto].tipo === 'vida') this.newEvent('atualizar-vida',{ ajusteVida: 1 });
                this.removerPonto({ id: ponto });
            }
        }
    }
}

export default Game;