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
    @Input() public clientId:string;
    private rooms:Room;
    private messages = [];

    constructor(private gameClient:GameClient) {
        gameClient.getRooms().subscribe((rooms) => {
            this.rooms = rooms;
        });

        gameClient.getMessages().subscribe((message) => {
            this.messages.push(message);
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
        this.gameClient.sendMessage(message);
    }


    public closedWindow(done:boolean):void {
        console.log(done);
    }
}