import {Component, OnInit, Input} from 'angular2/core';
import {WindowComponent} from "../windowComponent/WindowComponent";
import {LevelService, SonicLevelData} from "../services/LevelService";


@Component({
    selector: 'level-selector',
    templateUrl: 'app/layout/levelSelector/levelSelector.html',
    directives: [WindowComponent]
})
export class LevelSelector implements OnInit {
    @Input() public clientId:string;
    @Input() public otherClientId:string;
    private peer:PeerJs.Peer;

    constructor() {
    }

    ngOnInit() {
        /*       this._levelService.getLevels().subscribe(levels=>{
         this.levels=levels;
         });*/
    }

    public start():void {
        this.peer = new Peer(this.clientId, {
            host: 'localhost', port: 9000, path: '/',


            debug: 3,
            // Set a logging function:
            logFunction: function () {
                var copy = Array.prototype.slice.call(arguments).join(' ');
                console.log(copy);
            }
        });
        this.peer.on('connection', function(conn) {
            conn.on('data', function(data){
                // Will print 'hi!'
                console.log(data);
            });
            setInterval(()=>{conn.send('fuck you!');},500)
        });
    }

    public connect():void {
        var conn = this.peer.connect(this.otherClientId);
        conn.on('open', function () {
            setInterval(()=>{conn.send('hi!');},500)
        });
        conn.on('data', function(data){
            // Will print 'hi!'
            console.log(data);
        });
    }


    public closedWindow(done:boolean):void {
        console.log(done);
    }
}