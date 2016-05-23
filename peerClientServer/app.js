"use strict";
var WebRTC = require('webrtc-native');

for (var obj in WebRTC) {
    global[obj] = WebRTC[obj];
}

global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
global. WebSocket = require('ws');

require('./peer.js');

var peer = new Peer('j', {
    host: 'localhost', port: 9000, path: '/',
    debug: 3
});
peer.on('connection', (conn) => {
    console.log('o7pen');
    conn.on('data', (d) => {
        let message = {id: conn.peer, message: d.message, date: d.date, now: +new Date()};
console.log(message.id, message.now - message.date);
//         this.messageEmitter.emit(message);
    });
});



let conn = peer.connect('1', {serialization: 'json'});

conn.on('open', ()=> {
   console.log('open')
});
