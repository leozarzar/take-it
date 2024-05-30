const express = require('express');
const io = require('./io.js');
const http = require('http');
const path = require( "path" );
var fs = require('fs');

const app = express();
const port = 3000;

app.use(express.static( 'public' ));

app.get( "/demo", ( req, res ) => {

  res.status(200).send(JSON.parse(fs.readFileSync('./src/demo/states.json')));
});

//fs.writeFileSync('./src/demo/states.json', JSON.stringify(write));

const httpServer = http.createServer(app);
httpServer.listen(port, () => {

    console.log(`Ouvindo na porta ${port}.`);
})

io(httpServer);