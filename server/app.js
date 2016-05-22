var System = require('systemjs');
global.ts = require('typescript');
global.http = require('http');
global.socketIO = require('socket.io');


System.config({
    packages: {
        // meaning [baseURL]/local/package when no other rules are present
        // path is normalized using map and paths configuration
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
System.import('').catch(function(){
    console.log(arguments);
});
