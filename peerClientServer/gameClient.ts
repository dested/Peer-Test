export class GameClient {
    private socket:SocketIOClient.Socket;
    private activeRoom:ActiveRoom;
    myId:string;

    constructor() {

        this.socket = io('http://localhost:8844');


        let rooms:Room[];
        let peer:PeerJs.Peer;

        this.socket.on('set:id', (data) => {
            this.myId = data;
            console.log(data);
            peer = new Peer(this.myId, {
                host: 'localhost', port: 9000, path: '/',
                debug: 3
            });
            peer.on('connection', (conn) => {
                console.log('open');
                conn.on('data', (d) => {
                    let message = {id: conn.peer, message: d.message, date: d.date, now: +new Date()};
                    console.log(message.id, message.now - message.date);
                });
            });
        });
var inRoom=false;
        this.socket.on('rooms', (data) => {
            rooms = data;
            if(rooms.length>0 && !inRoom){
                inRoom=true;
                this.joinRoom(rooms[0].id);
            }
            console.log(rooms);
        });


        this.socket.on('start:room', (data) => {
            this.activeRoom = {connections: []};

            for (let i = 0; i < data.length; i++) {
                let id = data[i];

                let conn = peer.connect(id, {serialization: 'json'});
                let activeConnection = {connection: conn, id: id, open: false};
                this.activeRoom.connections.push(activeConnection);

                conn.on('open', ()=> {
                    activeConnection.open = true;

                    let count = 0;
                    for (var con of this.activeRoom.connections) {
                        if (con.open) {
                            count++;
                        }
                    }
                    if (count == this.activeRoom.connections.length) {
                        console.log('ready')
                        this.startMonkey();
                    }
                });
            }
        });

    }


    joinRoom(id:string) {
        this.socket.emit('join:room', {roomId: id});
    }

    startRoom() {
        this.socket.emit('start:room');
    }


    sendMessage(message:string) {
        for (let connection of this.activeRoom.connections) {
            if (connection.open) {
                connection.connection.send({message: message, date: +new Date()});
            }
        }
    }

    private startMonkey() {
        setTimeout(()=> {
            this.sendMessage((Math.random() * 10000).toString());
            this.startMonkey();
        }, Math.random() * 16)
    }
}


export interface Room {
    id:string;
    connections:Connection[];
}


export interface ActiveRoom {
    connections:ActiveConnection[];
}
export interface ActiveConnection {
    id:string;
    connection:PeerJs.DataConnection;
    open:boolean;
}

export interface Connection {
    id:string;
}