const express = require('express');
const io = require('./io.js');
const http = require('http');
const path = require( "path" );

const app = express();
const port = 3000;

app.use(express.static( 'public/main' ));

app.get( "/", ( req, res ) => {
  res.status(200).sendFile( path.join( __dirname + "/../public/main/main.html" ));
});

app.get( "/public/point.mp3", ( req, res ) => {
  res.status(200).sendFile( path.join( __dirname + "/../public/point.mp3" ));
});

const httpServer = http.createServer(app);
httpServer.listen(port, () => {

    console.log(`Ouvindo na porta ${port}.`);
})

io(httpServer);