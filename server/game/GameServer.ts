export class GameServer {
    private connections:Connection[] = [];
    private rooms:Room[] = [];

    constructor() {
        let app = global.http.createServer();
        let io = <SocketIO.Server> global.socketIO(app);

        app.listen(8844);


        let id = 0;
        io.on('connection', (socket) => {
            let connection:Connection = {socket: socket, id: (id++).toString(), room: null};
            this.connections.push(connection);
            socket.emit('set:id', connection.id);
            socket.on('get:rooms', ()=> {
                this.sendRooms([connection]);
            });

            socket.on('join:room', (data)=> {
                if (connection.room) {
                    connection.room.connections.splice(connection.room.connections.indexOf(connection), 1);
                    if (connection.room.connections.length == 0) {
                        this.rooms.splice(this.rooms.indexOf(connection.room), 1);
                    }
                }
                let joined = false;
                for (let i = 0; i < this.rooms.length; i++) {
                    let room = this.rooms[i];
                    if (room.id == data.roomId) {
                        joined = true;
                        room.connections.push(connection);
                        connection.room = room;
                    }
                }

                if (!joined) {
                    let room:Room = {id: data.roomId, connections: []};
                    room.connections.push(connection);
                    this.rooms.push(room);
                    connection.room = room;
                }

                this.sendRooms(this.connections);
            });


            socket.on('start:room', (data)=> {
                if (!connection.room)return;
                for (let c of connection.room.connections) {
                    c.socket.emit('start:room', connection.room.connections.filter(cc=>cc != c).map(c=>c.id));
                }

            });

            socket.on('disconnect', ()=> {
                if (connection.room) {
                    connection.room.connections.splice(connection.room.connections.indexOf(connection), 1);
                    if (connection.room.connections.length == 0) {
                        this.rooms.splice(this.rooms.indexOf(connection.room), 1);
                    }
                }
                this.connections.splice(this.connections.indexOf(connection), 1);

                this.sendRooms(this.connections);
            });

        });

    }

    private sendRooms(connections:Connection[]) {
        let data = this.rooms.map(room=> {
            return {
                id: room.id, connections: room.connections.map((c)=> {
                    return {id: c.id};
                })
            };
        });
        for (var connection of connections) {
            connection.socket.emit('rooms', data);
        }
    }
}


interface Connection {
    socket:SocketIO.Socket;
    id:string;
    room:Room;
}


interface Room {
    id:string;
    connections:Connection[];
}
