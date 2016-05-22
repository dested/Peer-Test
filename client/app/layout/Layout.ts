import {Component} from 'angular2/core';
import {LevelSelector} from "./levelSelector/LevelSelector";
import 'rxjs/Rx';

@Component({
    selector: 'layout',
    templateUrl: 'app/layout/layout.html',
    directives:[LevelSelector]
})
export class Layout {

}
 