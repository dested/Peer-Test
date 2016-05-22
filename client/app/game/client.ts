export class GameClient {

    constructor() {
        
        var peer = new Peer('another-peers-id', {host: 'localhost', port: 9000, path: '/'});
        var conn = peer.connect('someid');
        conn.on('open', function () {
            conn.send('hi!');
        });
        conn.on('data', function (data) {
            // Will print 'hi!'
            console.log(data);
        });
    }
}