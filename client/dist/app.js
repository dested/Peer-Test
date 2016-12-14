var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
System.register("layout/directives/draggableDirective", ["angular2/core"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1, DraggableDirective, _a;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            }
        ],
        execute: function () {
            DraggableDirective = (function () {
                function DraggableDirective(el) {
                    $(el.nativeElement).draggable({ cancel: ".window .inner-window" });
                }
                return DraggableDirective;
            }());
            DraggableDirective = __decorate([
                core_1.Directive({
                    selector: '[draggable]',
                }),
                __param(0, (core_1.Inject)),
                __metadata("design:paramtypes", [typeof (_a = typeof core_1.ElementRef !== "undefined" && core_1.ElementRef) === "function" && _a || Object])
            ], DraggableDirective);
            exports_1("DraggableDirective", DraggableDirective);
        }
    };
});
System.register("layout/windowComponent/WindowComponent", ["angular2/core", "layout/directives/draggableDirective"], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var core_2, draggableDirective_1, WindowComponent, _a, _b;
    return {
        setters: [
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (draggableDirective_1_1) {
                draggableDirective_1 = draggableDirective_1_1;
            }
        ],
        execute: function () {
            WindowComponent = (function () {
                function WindowComponent(el) {
                    this.onclose = new core_2.EventEmitter();
                    this.visible = true;
                }
                WindowComponent.prototype.minimize = function () {
                    this.visible = false;
                };
                WindowComponent.prototype.maximize = function () {
                    this.visible = false;
                };
                WindowComponent.prototype.close = function () {
                    this.visible = false;
                    this.onclose.emit(true);
                };
                return WindowComponent;
            }());
            __decorate([
                core_2.Input(),
                __metadata("design:type", Boolean)
            ], WindowComponent.prototype, "visible", void 0);
            __decorate([
                core_2.Input(),
                __metadata("design:type", String)
            ], WindowComponent.prototype, "width", void 0);
            __decorate([
                core_2.Input(),
                __metadata("design:type", String)
            ], WindowComponent.prototype, "height", void 0);
            __decorate([
                core_2.Input(),
                __metadata("design:type", String)
            ], WindowComponent.prototype, "left", void 0);
            __decorate([
                core_2.Input(),
                __metadata("design:type", String)
            ], WindowComponent.prototype, "top", void 0);
            __decorate([
                core_2.Input(),
                __metadata("design:type", String)
            ], WindowComponent.prototype, "windowTitle", void 0);
            __decorate([
                core_2.Output(),
                __metadata("design:type", typeof (_a = typeof core_2.EventEmitter !== "undefined" && core_2.EventEmitter) === "function" && _a || Object)
            ], WindowComponent.prototype, "onclose", void 0);
            WindowComponent = __decorate([
                core_2.Component({
                    selector: 'window',
                    templateUrl: 'app/layout/windowComponent/windowComponent.html',
                    directives: [draggableDirective_1.DraggableDirective],
                }),
                __metadata("design:paramtypes", [typeof (_b = typeof core_2.ElementRef !== "undefined" && core_2.ElementRef) === "function" && _b || Object])
            ], WindowComponent);
            exports_2("WindowComponent", WindowComponent);
        }
    };
});
System.register("game/gameClient", ["angular2/core", "rxjs/Rx"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var core_3, GameClient, _a;
    return {
        setters: [
            function (core_3_1) {
                core_3 = core_3_1;
            },
            function (_1) {
            }
        ],
        execute: function () {
            GameClient = (function () {
                function GameClient(zone) {
                    var _this = this;
                    this.zone = zone;
                    this.roomEmitter = new core_3.EventEmitter();
                    this.messageEmitter = new core_3.EventEmitter();
                    this.gameStateEmitter = new core_3.EventEmitter();
                    this.socket = io('http://localhost:8844');
                    var rooms;
                    var peer;
                    this.socket.on('set:id', function (data) {
                        _this.myId = data;
                        console.log(data);
                        peer = new Peer(_this.myId, {
                            host: 'localhost', port: 9000, path: '/',
                            debug: 3
                        });
                        peer.on('connection', function (conn) {
                            console.log('open');
                            conn.on('data', function (d) {
                                var message = { id: conn.peer, message: d.message, date: d.date, now: +new Date() };
                                // console.log(message.id, message.now - message.date);
                                _this.messageEmitter.emit(message);
                            });
                        });
                    });
                    this.socket.on('rooms', function (data) {
                        rooms = data;
                        _this.roomEmitter.emit(rooms);
                    });
                    this.socket.on('start:room', function (data) {
                        _this.activeRoom = { connections: [] };
                        var _loop_1 = function (i) {
                            var id = data[i];
                            var conn = peer.connect(id, { serialization: 'json' });
                            var activeConnection = { connection: conn, id: id, open: false };
                            _this.activeRoom.connections.push(activeConnection);
                            conn.on('open', function () {
                                activeConnection.open = true;
                                var count = 0;
                                for (var _i = 0, _a = _this.activeRoom.connections; _i < _a.length; _i++) {
                                    var con = _a[_i];
                                    if (con.open) {
                                        count++;
                                    }
                                }
                                if (count == _this.activeRoom.connections.length) {
                                    _this.zone.run(function () { return _this.gameStateEmitter.emit('ready'); });
                                }
                            });
                        };
                        for (var i = 0; i < data.length; i++) {
                            _loop_1(i);
                        }
                    });
                }
                GameClient.prototype.getRooms = function () {
                    return this.roomEmitter;
                };
                GameClient.prototype.getMessages = function () {
                    return this.messageEmitter;
                };
                GameClient.prototype.getGameState = function () {
                    return this.gameStateEmitter;
                };
                GameClient.prototype.joinRoom = function (id) {
                    this.socket.emit('join:room', { roomId: id });
                };
                GameClient.prototype.startRoom = function () {
                    this.socket.emit('start:room');
                };
                GameClient.prototype.sendMessage = function (message) {
                    for (var _i = 0, _a = this.activeRoom.connections; _i < _a.length; _i++) {
                        var connection = _a[_i];
                        if (connection.open) {
                            connection.connection.send({ message: message, date: +new Date() });
                        }
                    }
                };
                return GameClient;
            }());
            GameClient = __decorate([
                core_3.Injectable(),
                __metadata("design:paramtypes", [typeof (_a = typeof core_3.NgZone !== "undefined" && core_3.NgZone) === "function" && _a || Object])
            ], GameClient);
            exports_3("GameClient", GameClient);
        }
    };
});
System.register("layout/roomManager/RoomManager", ["angular2/core", "layout/windowComponent/WindowComponent", "game/gameClient"], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var core_4, WindowComponent_1, gameClient_1, RoomManager;
    return {
        setters: [
            function (core_4_1) {
                core_4 = core_4_1;
            },
            function (WindowComponent_1_1) {
                WindowComponent_1 = WindowComponent_1_1;
            },
            function (gameClient_1_1) {
                gameClient_1 = gameClient_1_1;
            }
        ],
        execute: function () {
            RoomManager = (function () {
                function RoomManager(gameClient) {
                    var _this = this;
                    this.gameClient = gameClient;
                    this.messages = [];
                    this.inRoom = false;
                    this.state = "none";
                    gameClient.getRooms().subscribe(function (rooms) {
                        _this.rooms = rooms;
                        if (_this.rooms.length > 0 && !_this.inRoom) {
                            _this.joinRoom(_this.rooms[0].id);
                        }
                    });
                    gameClient.getMessages().subscribe(function (message) {
                        _this.messages.push(message);
                        _this.messages = _this.messages.slice(-10, 10);
                    });
                    gameClient.getGameState().subscribe(function (state) {
                        _this.state = state;
                        if (_this.state == 'ready') {
                            _this.startMonkey();
                        }
                    });
                }
                RoomManager.prototype.ngOnInit = function () {
                };
                RoomManager.prototype.joinRoom = function (id) {
                    this.inRoom = true;
                    this.gameClient.joinRoom(id);
                };
                RoomManager.prototype.startRoom = function () {
                    this.gameClient.startRoom();
                };
                RoomManager.prototype.sendMessage = function (message) {
                    this.messages.push({ id: this.gameClient.myId, message: message, date: (+new Date()) + 1, now: new Date() });
                    this.gameClient.sendMessage(message);
                };
                RoomManager.prototype.closedWindow = function (done) {
                    console.log(done);
                };
                RoomManager.prototype.startMonkey = function () {
                    var _this = this;
                    setTimeout(function () {
                        _this.sendMessage((Math.random() * 10000).toString());
                        _this.startMonkey();
                    }, Math.random() * 16);
                };
                return RoomManager;
            }());
            RoomManager = __decorate([
                core_4.Component({
                    selector: 'room-manager',
                    templateUrl: 'app/layout/roomManager/roomManager.html',
                    directives: [WindowComponent_1.WindowComponent],
                    providers: [gameClient_1.GameClient]
                }),
                __metadata("design:paramtypes", [gameClient_1.GameClient])
            ], RoomManager);
            exports_4("RoomManager", RoomManager);
        }
    };
});
System.register("layout/Layout", ["angular2/core", "layout/roomManager/RoomManager", "rxjs/Rx"], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var core_5, RoomManager_1, Layout;
    return {
        setters: [
            function (core_5_1) {
                core_5 = core_5_1;
            },
            function (RoomManager_1_1) {
                RoomManager_1 = RoomManager_1_1;
            },
            function (_2) {
            }
        ],
        execute: function () {
            Layout = (function () {
                function Layout() {
                }
                return Layout;
            }());
            Layout = __decorate([
                core_5.Component({
                    selector: 'layout',
                    templateUrl: 'app/layout/layout.html',
                    directives: [RoomManager_1.RoomManager]
                }),
                __metadata("design:paramtypes", [])
            ], Layout);
            exports_5("Layout", Layout);
        }
    };
});
/// <reference path="../typings/Compress.d.ts" />
/// <reference path="../node_modules/angular2/typings/browser.d.ts" />
/// <reference path="../node_modules/angular2/core.d.ts" />
/// <reference path="../node_modules/angular2/http.d.ts" />
System.register("main", ["angular2/platform/browser", "layout/Layout", "angular2/http"], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var browser_1, Layout_1, http_1, Main;
    return {
        setters: [
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (Layout_1_1) {
                Layout_1 = Layout_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }
        ],
        execute: function () {/// <reference path="../typings/Compress.d.ts" />
            /// <reference path="../node_modules/angular2/typings/browser.d.ts" />
            /// <reference path="../node_modules/angular2/core.d.ts" />
            /// <reference path="../node_modules/angular2/http.d.ts" />
            Main = (function () {
                function Main() {
                }
                Main.run = function () {
                    browser_1.bootstrap(Layout_1.Layout, [http_1.HTTP_PROVIDERS]);
                };
                return Main;
            }());
            exports_6("Main", Main);
            Main.run();
        }
    };
});
