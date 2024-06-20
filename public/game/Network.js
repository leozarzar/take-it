
class Network{

    constructor(observers){

        this.observers = observers;
        const socket = io.connect(window.location.origin);
        this.socket = socket;

        socket.on('connect', () => {
    
            this.notifyAll("conectou");
        }); 
        
        socket.on('logado', ({gameId,args}) => { 

            this.notifyAll("recebeu-args",args);
            this.notifyAll("logado",gameId);
                
            socket.on('setup', (dados) => { 
            
                this.notifyAll("setup",dados);

                socket.on('update', (dados) => { 
                            
                    this.notifyAll("update",dados);
                })

                socket.on('add-point', (dados) => { 
            
                    this.notifyAll("adicionar-ponto",dados);
                });
                    
                socket.on('remove-point', (dados) => { 
                        
                    this.notifyAll("remover-ponto",dados);
                });
                    
                socket.on('add-player', (dados) => { 
        
                    this.notifyAll("adicionar-jogador",dados);
                });
                    
                socket.on('remove-player', (dados) => { 
        
                    this.notifyAll("remover-jogador",dados);
                });
                    
                socket.on('my-point', (dados) => { 
        
                    this.notifyAll("marcou-ponto",dados);
                });
                
                socket.on('someones-point', (dados) => { 
        
                    this.notifyAll("adversário-marcou-ponto",dados);
                });
                
                socket.on('everyones-point', (dados) => { 
        
                    this.notifyAll("todos-marcaram-ponto",dados);
                });

                socket.on('gameover', () => { 
        
                    this.notifyAll("gameover");
                });
            });

            socket.on('rodou-temporizador', (dados) => { 
        
                this.notifyAll("rodou-temporizador",dados);
            });
        });
    }

    notifyAll(comando,data){

        for(const observer of this.observers) observer(comando,data);
    }

    enviar(tipo,dados){

        this.socket.emit(tipo,dados);
    }
}

export default Network;