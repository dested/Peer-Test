"use strict";
var WebRTC = require('webrtc-native');

for (var obj in WebRTC) {
    global[obj] = WebRTC[obj];
}

global. WebSocket = require('ws');

require('./peer.js');
var System = require('systemjs');
global.ts = require('typescript');
global.http = require('http');
global.io = require('socket.io-client');


System.config({
    packages: {
        '': {
            main: 'main.ts',
            defaultExtension: 'ts',
            meta: {
                '*': {
                    format: 'esm'
                }
            }
        }
    },
    transpiler: 'typescript',
    baseURL: '',
    typescriptOptions: {
        resolveTypings: true,
        emitDecoratorMetadata: true,
        sourceMap: true,
        inlineSourceMap: true
    }
});
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
System.import('').catch(function(){
    console.log(arguments);
});
