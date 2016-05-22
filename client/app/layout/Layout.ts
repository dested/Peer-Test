import {Component} from 'angular2/core';
import {RoomManager} from "./roomManager/RoomManager";
import 'rxjs/Rx';

@Component({
    selector: 'layout',
    templateUrl: 'app/layout/layout.html',
    directives:[RoomManager]
})
export class Layout {

}
 