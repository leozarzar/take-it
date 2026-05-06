# Take It!

Jogo multiplayer de coleta de pontos em tempo real, rodando no navegador. Cada jogador controla um cursor num tabuleiro compartilhado e precisa chegar primeiro nos pontos que aparecem para marcar pontuação. A partida termina quando o tempo acaba.

## Tecnologias

- **Backend:** Node.js · Express · Socket.IO · Sequelize + SQLite
- **Frontend:** Vanilla JS · Canvas-less DOM · CSS puro

## Como rodar

**Pré-requisitos:** Node.js 18+

```bash
# Instalar dependências
npm install

# Iniciar o servidor (com hot-reload via nodemon)
npm start
```

Acesse `http://localhost:3000` no navegador.

## Fluxo do jogo

1. **Nome** — informe seu nome de usuário na tela inicial.
2. **Lobby** — crie uma sala ou entre numa existente.
3. **Pronto** — todos os jogadores marcam "Pronto"; quando todos confirmam, a partida começa simultaneamente para todos.
4. **Partida** — mova o cursor pelo tabuleiro usando as teclas WASD ou as setas (também suporta toque em mobile). Chegue primeiro nos pontos para pontuá-los.
5. **Game Over** — ao fim do tempo, o placar final é exibido.

## Estrutura do projeto

```
src/
  game.js       → lógica central, gerenciamento de salas e eventos de rede
  server.js     → servidor HTTP + Socket.IO, roteamento de eventos
  demo/         → dados da animação demo exibida na tela inicial

public/
  index.html    → SPA: tela de nome → lobby → sala → jogo
  styles.css    → design system global
  view.js       → lógica da tela de nome e transição para o lobby
  lobby.js      → lógica de lobby (lista de salas, pronto, sair)
  Jogador.js    → renderização do cursor no tabuleiro (tela inicial)
  Ponto.js      → renderização dos pontos (tela inicial)
  script.js     → animação demo da tela inicial

  game/
    index.html  → página da partida em si
    Tabuleiro.js → lógica do tabuleiro (Observer pattern)
    Jogador.js  → estado e renderização do jogador na partida
    Ponto.js    → estado e renderização dos pontos na partida
    Network.js  → comunicação Socket.IO durante a partida
    game.js     → inicialização e loop da partida no cliente
    controle.js → captura de teclado e toque
    view.js     → DOM helpers da partida
    touch.js    → controles de toque para mobile
```

## Arquitetura

O backend usa o **padrão Observer**: `game.js` registra um observer no server que recebe todos os eventos de socket (`novo-jogador`, `nova-movimentação`, etc.) e os despacha para as funções corretas.

Cada sala tem seu próprio `Tabuleiro` isolado. O servidor mantém três mapas:

- `salas` — estado completo de cada sala
- `socketEmSalaLobby` — socket → salaId (fase de lobby)
- `socketEmSalaJogo` — socket → salaId (fase de jogo)

A partida só inicia quando **todos** os membros da sala marcam "Pronto", garantindo que todos comecem ao mesmo tempo.
