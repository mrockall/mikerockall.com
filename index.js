// Import the Express module
var express = require('express');

// Import the 'path' module (packaged with Node.js)
var path = require('path');

// Create a new instance of Express
var app = express();

// Set the engine as EJS
app.set('view engine', 'ejs');

// Connect to the database
var mongo = require('mongodb');

// Create a simple Express application
app.configure(function() {
    // Turn down the logging activity
    app.use(express.logger('dev'));

    // Serve static html, js, css, and image files from the 'public' directory
    app.use(express.static(path.join(__dirname,'public')));

    app.use("/css",  express.static(__dirname + '/public/css'));
    app.use("/app",  express.static(__dirname + '/public/app'));
    app.use("/libs", express.static(__dirname + '/public/libs'));
    app.use("/components", express.static(__dirname + '/bower_components'));
});

// Add the FavIcon
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));

// Route everything through index and let Backbone route them!
app.get('*', function(req, res){
    res.render(__dirname + '/public/index');
});

// Create a Node.js based http server on port 8080
var server = require('http').createServer(app).listen(9001);

// Create a Socket.IO server and attach it to the http server
var io = require('socket.io').listen(server);

// Reduce the logging output of Socket.IO
io.set('log level', 1);

// Listen for Socket.IO Connections. Once connected, start the game logic.
io.sockets.on('connection', function (socket) {

});