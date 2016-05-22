import {Injectable, EventEmitter} from "angular2/core";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class GameClient {
    private socket:SocketIOClient.Socket;
    private roomEmitter:any;
    private messageEmitter:any;
    private activeRoom:ActiveRoom;

    constructor() {
        this.roomEmitter = new EventEmitter();
        this.messageEmitter = new EventEmitter();

        this.socket = io('http://localhost:8844');


        setInterval(()=> {
            this.socket.emit('get:rooms');
        }, 1000);

        let myId:string;
        let rooms:Room[];
        let peer:PeerJs.Peer;

        this.socket.on('set:id', (data) => {
            myId = data;
            console.log(data);
            peer = new Peer(myId, {
                host: 'localhost', port: 9000, path: '/',
                debug: 3/*,
                 logFunction: function () {
                 var copy = Array.prototype.slice.call(arguments).join(' ');
                 console.log(copy);
                 }*/
            });
            peer.on('connection', (conn) => {
                console.log('open');
                conn.on('data', (d) => {
                    console.log({id: conn.peer, message: d})
                    this.messageEmitter.next({id: conn.peer, message: d});
                });
            });
        });

        this.socket.on('rooms', (data) => {
            rooms = data;
            this.roomEmitter.next(rooms);
        });


        this.socket.on('start:room', (data) => {
            this.activeRoom = {connections: []};

            for (var i = 0; i < data.length; i++) {
                let id = data[i];

                let conn = peer.connect(id);
                let activeConnection = {connection: conn, id: id, open: false};
                this.activeRoom.connections.push(activeConnection);

                conn.on('open', ()=> {
                    activeConnection.open = true;

                });
            }
        });

    }

    getRooms():any {
        return this.roomEmitter;
    }

    getMessages() {
        return this.messageEmitter;
    }

    joinRoom(id:string) {
        this.socket.emit('join:room', {roomId: id});
    }

    startRoom() {
        this.socket.emit('start:room');
    }


    sendMessage(message:string) {
        for (var connection of this.activeRoom.connections) {
            if (connection.open) {
                connection.connection.send(message);
            }
        }
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