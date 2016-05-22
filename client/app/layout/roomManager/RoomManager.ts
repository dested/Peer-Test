import {Component, OnInit, Input} from 'angular2/core';
import {WindowComponent} from "../windowComponent/WindowComponent";
import {GameClient, Room} from "../../game/client";


@Component({
    selector: 'room-manager',
    templateUrl: 'app/layout/roomManager/roomManager.html',
    directives: [WindowComponent],
    providers: [GameClient]
})
export class RoomManager implements OnInit {
    public state:string;
    public rooms:Room;
    public messages = [];

    constructor(private gameClient:GameClient) {
        this.state = "none";
        gameClient.getRooms().subscribe((rooms) => {
            this.rooms = rooms;
        });

        gameClient.getMessages().subscribe((message) => {
            message.now = +new Date();
            this.messages.push(message);
            this.messages=this.messages.slice(-10,10)
            var divd = document.getElementById('divdiv');
            divd.scrollTop = divd.scrollHeight;
        });
        gameClient.getGameState().subscribe(state=> {
            this.state = state;
            if (this.state == 'ready') {
                this.startMonkey();
            }
        });
    }

    ngOnInit() {
    }

    public joinRoom(id:string):void {
        this.gameClient.joinRoom(id);
    }

    public startRoom():void {
        this.gameClient.startRoom();
    }

    public sendMessage(message:string):void {
        this.messages.push({id: this.gameClient.myId, message: message, date: (+new Date()) + 1, now: new Date()});
        this.gameClient.sendMessage(message);
    }


    public closedWindow(done:boolean):void {
        console.log(done);
    }

    private startMonkey() {

        setTimeout(()=> {
            this.sendMessage((Math.random() * 10000).toString());
            this.startMonkey();
        }, Math.random() * 750)

    }
}