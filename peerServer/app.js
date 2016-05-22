var PeerServer = require('peer').PeerServer;
var server = PeerServer({port: 9000, path: '/',


    debug: 3,
    // Set a logging function:
    logFunction: function () {
        var copy = Array.prototype.slice.call(arguments).join(' ');
        console.log(copy);
    }});