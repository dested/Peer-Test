export class GameServer {

    constructor() {
        let app = global.http.createServer();
        let io = <SocketIO.Server> global.socketIO(app);

        app.listen(8844);

        let connections:Connection[] = [];

        let rooms:Room[] = [];

        let id = 0;
        io.on('connection', (socket) => {
            let connection:Connection = {socket: socket, id: (id++).toString(), room: null};
            connections.push(connection);
            socket.emit('set:id', connection.id);
            socket.on('get:rooms', ()=> {
                socket.emit('rooms', rooms.map((room)=> {
                    return {
                        id: room.id, connections: room.connections.map((c)=> {
                            return {id: c.id};
                        })
                    };
                }));
            });

            socket.on('join:room', (data)=> {
                if (connection.room) {
                    connection.room.connections.splice(connection.room.connections.indexOf(connection), 1);
                    if (connection.room.connections.length == 0) {
                        rooms.splice(rooms.indexOf(connection.room), 1);
                    }
                }
                let joined = false;
                for (let i = 0; i < rooms.length; i++) {
                    let room = rooms[i];
                    if (room.id == data.roomId) {
                        joined = true;
                        room.connections.push(connection);
                        connection.room = room;
                    }
                }

                if (!joined) {
                    let room:Room = {id: data.roomId, connections: []};
                    room.connections.push(connection);
                    rooms.push(room);
                    connection.room = room;
                }
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
                        rooms.splice(rooms.indexOf(connection.room), 1);
                    }
                }
                connections.splice(connections.indexOf(connection), 1);
            });

        });

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
