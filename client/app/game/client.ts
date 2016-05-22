import {Injectable, EventEmitter, NgZone} from "angular2/core";
import 'rxjs/Rx';

@Injectable()
export class GameClient {
    private socket:SocketIOClient.Socket;
    private roomEmitter:EventEmitter<Room[]>;
    private messageEmitter:EventEmitter<{id:string,message:string}>;
    private gameStateEmitter:EventEmitter<string>;
    private activeRoom:ActiveRoom;
    myId:string;

    constructor(private zone:NgZone) {
        this.roomEmitter = new EventEmitter();
        this.messageEmitter = new EventEmitter();
        this.gameStateEmitter = new EventEmitter();

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
                    let message = {id: conn.peer, message: d.message, date: d.date};
                    // console.log(message);
                    this.zone.run(()=>this.messageEmitter.emit(message))
                });
            });
        });

        this.socket.on('rooms', (data) => {
            rooms = data;
            this.roomEmitter.emit(rooms);
        });


        this.socket.on('start:room', (data) => {
            this.activeRoom = {connections: []};

            for (let i = 0; i < data.length; i++) {
                let id = data[i];

                let conn = peer.connect(id);
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
                    if (count == this.activeRoom.connections.length - 1) {
                        this.zone.run(()=>this.gameStateEmitter.emit('ready'))
                    }
                });
            }
        });

    }

    getRooms():EventEmitter<Room[]> {
        return this.roomEmitter;
    }

    getMessages():EventEmitter<{id:string,message:string}> {
        return this.messageEmitter;
    }

    getGameState():EventEmitter<string> {
        return this.gameStateEmitter;
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