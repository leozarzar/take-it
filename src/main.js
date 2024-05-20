const express = require('express');
const io = require('./io.js');
const http = require('http');

const app = express();
const port = 3000;

app.get("/", (req,res) => {
    res.status(200).send({mensagem: "Funcionou!!!"});
})

const httpServer = http.createServer(app);
httpServer.listen(port, () => {

    console.log(`Ouvindo na porta ${port}.`);
})

io(httpServer);