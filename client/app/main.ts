/// <reference path="../typings/Compress.d.ts" />
/// <reference path="../node_modules/angular2/typings/browser.d.ts" />
/// <reference path="../node_modules/angular2/core.d.ts" />
/// <reference path="../node_modules/angular2/http.d.ts" />

import {bootstrap}    from 'angular2/platform/browser';
import {Layout} from './layout/Layout';
import {HTTP_PROVIDERS} from 'angular2/http';
import {GameClient} from "./game/client";

export class Main {
    static run() {
        new GameClient();
        bootstrap(Layout, [HTTP_PROVIDERS]);
    }
}

Main.run();