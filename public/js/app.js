(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Hex = require("./../Generic/Hex");

var _Hex2 = _interopRequireDefault(_Hex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sprites = {
    0: ["F0", "90", "90", "90", "F0"],
    1: ["20", "60", "20", "20", "70"],
    2: ["F0", "10", "F0", "80", "F0"],
    3: ["F0", "10", "F0", "10", "F0"],
    4: ["90", "90", "F0", "10", "10"],
    5: ["F0", "80", "F0", "10", "F0"],
    6: ["F0", "80", "F0", "90", "F0"],
    7: ["F0", "10", "20", "40", "40"],
    8: ["F0", "90", "F0", "90", "F0"],
    9: ["F0", "90", "F0", "10", "F0"],
    a: ["F0", "90", "F0", "90", "90"],
    b: ["E0", "90", "E0", "90", "E0"],
    c: ["F0", "80", "80", "80", "F0"],
    d: ["E0", "90", "90", "90", "E0"],
    e: ["F0", "80", "F0", "80", "F0"],
    f: ["F0", "80", "F0", "80", "80"]
};

var startingTitle = "Drop or click load roam to load game";

/**
 * @property {CPU} cpu
 */

var GameRunnerController = function () {
    function GameRunnerController($scope, $rootScope, $timeout, CpuService, SettingsService, SidePanelService) {
        var _this = this;

        _classCallCheck(this, GameRunnerController);

        this.cpu = CpuService;
        this.settings = SettingsService;
        this.lastFrameTime = 0;
        this.sidePanel = SidePanelService;

        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$scope.settings = SettingsService;
        this.$scope.title = startingTitle;
        this.$scope.sidePanel = this.sidePanel;
        this.$scope.keepRunning = false;
        this.$scope.pause = false;

        this.$scope.cpu = this.cpu;
        this.$scope.reset = function () {
            _this.reset();
        };
        this.$scope.softReset = function () {
            _this.softReset();
        };
        this.$scope.debug = function () {
            _this.debug();
        };

        $rootScope.$on("gameAnalyzed", function (e, rom, gameFile) {
            _this.currentGame = gameFile;
            _this.storeHexadecimalSpritesInRom(rom);
            _this.cpu.memory.storeChunk(rom, new _Hex2.default("0"));
            _this.start(rom);
        });
        this.animationFrame();
    }

    _createClass(GameRunnerController, [{
        key: "start",
        value: function start() {
            var _this2 = this;

            this.$scope.title = "[Running] " + this.currentGame.name;
            this.cpu.pc.jumpTo(new _Hex2.default("200"));

            this.$scope.keepRunning = true;
            this.$scope.started = true;
            this.$scope.nextStep = function () {
                _this2.cpu.nextInstruction();
            };
            this.$scope.run = function () {
                _this2.run();
            };
            this.run();
        }
    }, {
        key: "run",
        value: function run() {
            var _this3 = this;

            if (this.isRunning()) {
                if (!this.isPaused()) {
                    var time = new Date().getTime();
                    if (!this.settings.restrictSpeed || time - this.lastFrameTime > 1000 / this.settings.instructionsPerSecond) {
                        this.lastFrameTime = time;
                        if (!this.cpu.nextInstruction()) {
                            this.error();
                            return;
                        }
                    }
                }

                setImmediate(function () {
                    _this3.run();
                });
            }
        }
    }, {
        key: "animationFrame",
        value: function animationFrame() {
            var _this4 = this;

            this.$scope.$evalAsync(function () {
                window.requestAnimationFrame(function () {
                    if (_this4.isRunning()) {
                        _this4.cpu.animationFrame();
                    }
                    _this4.animationFrame();
                });
            });
        }
    }, {
        key: "pause",
        value: function pause() {
            if (this.isRunning()) {
                this.title = "[Paused] " + this.currentGame.name;
                this.$scope.pause = true;
            }
        }
    }, {
        key: "stop",
        value: function stop() {
            this.$scope.keepRunning = false;
        }
    }, {
        key: "readSprite",
        value: function readSprite(start, size) {
            var i = void 0,
                sprite = [],
                end = void 0;
            end = start + parseInt(size, 16);
            for (i = start; i < end; i += 1) {
                var binary = Number(parseInt(this.gameData.rom[i], 16)).toString(2);
                sprite.push("00000000".substr(binary.length) + binary);
            }
            return sprite;
        }
    }, {
        key: "storeHexadecimalSpritesInRom",
        value: function storeHexadecimalSpritesInRom(rom) {
            var i = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(sprites)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var spriteName = _step.value;
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = sprites[spriteName][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var byte = _step2.value;

                            rom[i] = byte;
                            i += 1;
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: "setRegister",
        value: function setRegister(register, value) {
            if (value.length == 1) {
                value = "0" + value;
            }
            this.gameData.registers["v" + register] = value;
        }
    }, {
        key: "getRegister",
        value: function getRegister(register) {
            return this.gameData.registers["v" + register];
        }
    }, {
        key: "reset",
        value: function reset() {
            this.$scope.title = startingTitle;
            this.stop();
            this.cpu.reset();
            this.currentGame = null;
        }
    }, {
        key: "softReset",
        value: function softReset() {
            if (this.isRunning()) {
                this.stop();
                this.cpu.softReset();
                this.start();
            }
        }
    }, {
        key: "error",
        value: function error() {
            this.$scope.title = "Error occurred, emulation stopped";
            this.$scope.keepRunning = false;
        }
    }, {
        key: "isRunning",
        value: function isRunning() {
            return this.$scope.keepRunning;
        }
    }, {
        key: "isPaused",
        value: function isPaused() {
            return this.$scope.pause;
        }
    }, {
        key: "debug",
        value: function debug() {
            if (this.currentGame) {
                this.pause();
                this.$scope.title = "[Debugging] " + this.currentGame.name;
                this.sidePanel.debug();
            }
        }
    }]);

    return GameRunnerController;
}();

exports.default = GameRunnerController;

},{"./../Generic/Hex":6}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoadRoamDirective = function () {
    function LoadRoamDirective(RoamLoaderService, CPU) {
        _classCallCheck(this, LoadRoamDirective);

        this.cpu = CPU;
        this.restrict = "A";
        this.roamLoader = RoamLoaderService;
    }

    _createClass(LoadRoamDirective, [{
        key: "link",
        value: function link($scope, element, attrs) {
            var button = element[0].getElementsByTagName("button").item(0),
                input = element[0].getElementsByTagName("input").item(0);
            this.registerButtonEvents(button, input);
        }
    }, {
        key: "registerButtonEvents",
        value: function registerButtonEvents(button, input) {
            var _this = this;

            button.addEventListener("click", function (e) {
                input.click();
            });
            input.addEventListener("change", function (e) {
                _this.fileSelected(e, e.target.files[0]);
                e.target.value = "";
            });
            button.addEventListener("drop", function (e) {
                _this.fileSelected(e, e.dataTransfer.files[0]);
            });
            window.addEventListener("drop", function (e) {
                _this.fileSelected(e, e.dataTransfer.files[0]);
            });
            window.addEventListener("dragover", function (e) {
                _this.fileDragged(e, e.dataTransfer.files[0]);
            });
        }

        /**
         * Without catching dragOver event drop event won't be catched.
         * @param e
         * @param file
         */

    }, {
        key: "fileDragged",
        value: function fileDragged(e, file) {
            e.stopPropagation();
            e.preventDefault();
        }
    }, {
        key: "fileSelected",
        value: function fileSelected(e, file) {
            e.stopPropagation();
            e.preventDefault();

            if (file) {
                this.stopCurrentGame();
                this.roamLoader.load(file);
            }
        }
    }, {
        key: "stopCurrentGame",
        value: function stopCurrentGame() {
            this.cpu.reset();
        }
    }]);

    return LoadRoamDirective;
}();

exports.default = LoadRoamDirective;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KeypadDirective = function () {
    function KeypadDirective() {
        _classCallCheck(this, KeypadDirective);

        this.restrict = "A";
        this.templateUrl = "directive/keypad.html";
        this.replace = true;
        this.scope = false;
    }

    _createClass(KeypadDirective, [{
        key: "controller",
        value: function controller($scope, $rootScope) {}
    }, {
        key: "link",
        value: function link($scope, element, attrs) {}
    }]);

    return KeypadDirective;
}();

exports.default = KeypadDirective;

},{}],4:[function(require,module,exports){
"use strict";

/**
 * @property {Array<Array<int>>} pixels
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ScreenDirective = function () {
    function ScreenDirective() {
        _classCallCheck(this, ScreenDirective);

        this.restrict = "E";
        this.templateUrl = "directive/screen.html";
        this.replace = true;
    }

    _createClass(ScreenDirective, [{
        key: "controller",
        value: function controller($scope, $rootScope) {}
    }, {
        key: "link",
        value: function link($scope, element, attrs) {
            var _this = this;

            $scope.$root.$on("screenUpdated", function (e, pixels) {
                _this.updateScreen(pixels);
            });
            this.canvas = element[0].getElementsByTagName("canvas")[0];
            this.ctx = this.canvas.getContext("2d");
            this.pixelSize = {
                height: this.canvas.clientHeight / 32,
                width: this.canvas.clientWidth / 64
            };
            this.canvas.height = this.canvas.clientHeight;
            this.canvas.width = this.canvas.clientWidth;
        }

        /**
         *
         * @param {Array.<int>} newPixels
         */

    }, {
        key: "updateScreen",
        value: function updateScreen(newPixels) {
            if (!this.pixels) {
                this.pixels = [];
                for (var key in newPixels) {
                    if (newPixels.hasOwnProperty(key)) {
                        this.pixels[key] = newPixels[key].slice();
                    }
                }
                this.paintAll();
            } else {
                this.selectivePaint(newPixels);
            }
        }
    }, {
        key: "paintAll",
        value: function paintAll() {
            var pixelsIterator = this.iteratePixels(),
                pixelData = void 0;

            while (pixelData = pixelsIterator.next().value) {
                this.paintPixel(pixelData[0], pixelData[1], pixelData[2]);
            }
        }
    }, {
        key: "selectivePaint",
        value: function selectivePaint(newPixels) {
            var newPixelValue = void 0,
                pixelData = void 0,
                pixelsIterator = this.iteratePixels();

            while (pixelData = pixelsIterator.next().value) {
                newPixelValue = newPixels[pixelData[0]][pixelData[1]];
                if (pixelData[2] != newPixelValue) {
                    this.paintPixel(pixelData[0], pixelData[1], newPixelValue);
                }
            }
        }
    }, {
        key: "paintPixel",
        value: function paintPixel(y, x, pixelValue) {
            this.pixels[y][x] = pixelValue;
            if (pixelValue) {
                this.ctx.fillStyle = "white";
            } else {
                this.ctx.fillStyle = "black";
            }
            this.ctx.fillRect(x * this.pixelSize.width, y * this.pixelSize.height, this.pixelSize.width, this.pixelSize.height);
        }
    }, {
        key: "iteratePixels",
        value: regeneratorRuntime.mark(function iteratePixels() {
            var y, x;
            return regeneratorRuntime.wrap(function iteratePixels$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.t0 = regeneratorRuntime.keys(this.pixels);

                        case 1:
                            if ((_context.t1 = _context.t0()).done) {
                                _context.next = 14;
                                break;
                            }

                            y = _context.t1.value;

                            if (!this.pixels.hasOwnProperty(y)) {
                                _context.next = 12;
                                break;
                            }

                            _context.t2 = regeneratorRuntime.keys(this.pixels[y]);

                        case 5:
                            if ((_context.t3 = _context.t2()).done) {
                                _context.next = 12;
                                break;
                            }

                            x = _context.t3.value;

                            if (!this.pixels[y].hasOwnProperty(x)) {
                                _context.next = 10;
                                break;
                            }

                            _context.next = 10;
                            return [y, x, this.pixels[y][x]];

                        case 10:
                            _context.next = 5;
                            break;

                        case 12:
                            _context.next = 1;
                            break;

                        case 14:
                        case "end":
                            return _context.stop();
                    }
                }
            }, iteratePixels, this);
        })
    }]);

    return ScreenDirective;
}();

exports.default = ScreenDirective;


ScreenDirective.$inject = ["$rootScope"];

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SidePanel = function () {
    function SidePanel() {
        _classCallCheck(this, SidePanel);

        this.restrict = "A";
        this.templateUrl = "directive/side-panel.html";
        this.replace = true;
        this.scope = false;
    }

    _createClass(SidePanel, [{
        key: "controller",
        value: function controller($scope, $rootScope) {}
    }, {
        key: "link",
        value: function link($scope, element, attrs) {}
    }]);

    return SidePanel;
}();

exports.default = SidePanel;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Hex = function () {

    /**
     * @param {String} value
     */
    function Hex(value) {
        _classCallCheck(this, Hex);

        this.setTo(value);
    }

    _createClass(Hex, [{
        key: "compare",
        value: function compare(hex) {
            return this.value == hex.value;
        }
    }, {
        key: "toDec",
        value: function toDec() {
            return parseInt(this.value, 16);
        }
    }, {
        key: "increment",
        value: function increment() {
            var isRegister = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            this.add(new Hex("1"), isRegister);
        }
    }, {
        key: "decrement",
        value: function decrement() {
            var isRegister = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            this.subtract(new Hex("1"), isRegister);
        }
    }, {
        key: "round",
        value: function round(nibblesCount) {
            this.value = this.value.slice(-nibblesCount);
        }
    }, {
        key: "toRegister",
        value: function toRegister() {
            var number = this.toDec();
            if (number > 255) {
                number -= 256;
            }
            this.value = number.toString(16);
            // this.value = (this.toDec() & 0xff).toString(16);
        }
    }, {
        key: "toRegisterI",
        value: function toRegisterI() {
            this.value = (this.toDec() & 0xffff).toString(16);
        }

        /**
         * @param {Hex} hex
         * @param {boolean} isRegister registers must have value between 0 and 255 while some other data may so we need to indicate if current hash
         *                   simulates register
         * @returns {boolean} true if isRegister = true and result > 256 (ff) as some chip8 instructions require action to be taken in that case
         */

    }, {
        key: "add",
        value: function add(hex) {
            var isRegister = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var decimalValue = parseInt(this.value, 16);
            var decimalAddedValue = parseInt(hex.value, 16);
            var result = decimalValue + decimalAddedValue;
            var carry = false;

            if (isRegister) {
                carry = (result & 0xFFFFFF00) !== 0;
                if (result > 255) {
                    result -= 256;
                }
                // result &= 0xff;
            }
            this.value = result.toString(16);

            return carry;
        }

        /**
         * @param {Hex} hex
         * @param {boolean} isRegister registers must have value between 0 and 255 while some other data may so we need to indicate if current hash
         *                   simulates register
         * @returns {boolean} true if isRegister = true and result < 0 as some chip8 instructions require action to be taken in that case
         */

    }, {
        key: "subtract",
        value: function subtract(hex) {
            var isRegister = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var decimalValue = parseInt(this.value, 16);
            var decimalAddedValue = parseInt(hex.value, 16);
            var result = decimalValue - decimalAddedValue;
            var carry = false;

            if (isRegister) {
                carry = decimalValue >= decimalAddedValue;
                if (result < 0) {
                    result += 256;
                }
                // result &= 0xff;
            }

            this.value = result.toString(16);

            return carry;
        }
    }, {
        key: "divideByTwo",
        value: function divideByTwo() {
            var result = parseInt(this.value, 16) >> 1;
            this.value = result.toString(16);
        }

        /**
         * If result is > 255 then 256 will be subtracted to simulate register hex (0x00-0xff) as only
         * registers are multiplied by 2.
         */

    }, {
        key: "multiplyByTwo",
        value: function multiplyByTwo() {
            var isRegister = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var result = parseInt(this.value, 16) << 1;
            if (isRegister) {
                if (result > 255) {
                    result -= 256;
                }
                // result &= 0xff;
            }
            this.value = result.toString(16);
        }
    }, {
        key: "or",
        value: function or(hex) {
            var decimalValue = parseInt(this.value, 16);
            var decimalHexValue = parseInt(hex.value, 16);
            this.value = (decimalValue | decimalHexValue).toString(16);
        }
    }, {
        key: "and",
        value: function and(hex) {
            var decimalValue = parseInt(this.value, 16);
            var decimalHexValue = parseInt(hex.value, 16);
            this.value = (decimalValue & decimalHexValue).toString(16);
        }
    }, {
        key: "xor",
        value: function xor(hex) {
            var decimalValue = parseInt(this.value, 16);
            var decimalHexValue = parseInt(hex.value, 16);
            this.value = (decimalValue ^ decimalHexValue).toString(16);
        }

        /**
         * Makes it easy to avoid problems when accessing stack or registers memory which can hold
         * up to 16 (0xf) values so there is no unexpected access to non existing cells like 0x01.
         * @returns {string}
         */

    }, {
        key: "lowestNibble",
        value: function lowestNibble() {
            return this.value.slice(-1);
        }

        /**
         * Some hexes will have 00 value while others 0 which will result in not matching values
         * so this function makes sure values 0x0f and 0xf are seen as equal.
         * @param hex
         * @returns {boolean}
         */

    }, {
        key: "isEqualTo",
        value: function isEqualTo(hex) {
            return this.realValue() == hex.realValue();
        }
    }, {
        key: "realValue",
        value: function realValue() {
            var charsToDiscard = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var char = _step.value;

                    if (char == "0") {
                        charsToDiscard += 1;
                    } else {
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            if (charsToDiscard == this.value.length) {
                return "0";
            }

            return this.value.substring(charsToDiscard);
        }

        /**
         * Avoids hard to debug problems when hex is passed as reference which is default JavaScript behaviour.
         * @returns {Hex}
         */

    }, {
        key: "copy",
        value: function copy() {
            return new Hex(this.value);
        }

        /**
         * @param {String} value
         */

    }, {
        key: "setTo",
        value: function setTo(value) {
            this.value = String(value);
        }

        /**
         * This class is convenient place to put random hex in which is required by one of chip8 instructions.
         * @param {Hex} hexMax
         * @returns {Hex}
         */

    }], [{
        key: "random",
        value: function random(hexMax) {
            return new Hex(Math.floor(Math.random() * (hexMax.toDec() + 1)).toString(16));
        }
    }]);

    return Hex;
}();

exports.default = Hex;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

var _Hex = require("./../Hex");

var _Hex2 = _interopRequireDefault(_Hex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AddIVx = function (_InstructionHandler) {
    _inherits(AddIVx, _InstructionHandler);

    function AddIVx() {
        _classCallCheck(this, AddIVx);

        return _possibleConstructorReturn(this, (AddIVx.__proto__ || Object.getPrototypeOf(AddIVx)).apply(this, arguments));
    }

    _createClass(AddIVx, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            this.cpu.registerI.add(this.cpu.registers.read(opCode.hex(1, 1)).copy());
        }
    }]);

    return AddIVx;
}(_InstructionHandler3.default);

exports.default = AddIVx;


AddIVx.instructionRegex = "f.1e";

},{"./../Hex":6,"./InstructionHandler":14}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AddVxByte = function (_InstructionHandler) {
    _inherits(AddVxByte, _InstructionHandler);

    function AddVxByte() {
        _classCallCheck(this, AddVxByte);

        return _possibleConstructorReturn(this, (AddVxByte.__proto__ || Object.getPrototypeOf(AddVxByte)).apply(this, arguments));
    }

    _createClass(AddVxByte, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            this.cpu.registers.read(opCode.hex(1, 1)).add(opCode.hex(2, 2), true);
        }
    }]);

    return AddVxByte;
}(_InstructionHandler3.default);

exports.default = AddVxByte;


AddVxByte.instructionRegex = "7...";

},{"./InstructionHandler":14}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

var _Hex = require("./../Hex");

var _Hex2 = _interopRequireDefault(_Hex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AddVxVy = function (_InstructionHandler) {
    _inherits(AddVxVy, _InstructionHandler);

    function AddVxVy() {
        _classCallCheck(this, AddVxVy);

        return _possibleConstructorReturn(this, (AddVxVy.__proto__ || Object.getPrototypeOf(AddVxVy)).apply(this, arguments));
    }

    _createClass(AddVxVy, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            var vxValue = this.cpu.registers.read(opCode.hex(1));
            var vyValue = this.cpu.registers.read(opCode.hex(2));
            var carry = vxValue.add(vyValue, true);

            carry = carry == true ? new _Hex2.default("1") : new _Hex2.default("0");
            this.cpu.registers.store(new _Hex2.default("f"), carry);
        }
    }]);

    return AddVxVy;
}(_InstructionHandler3.default);

exports.default = AddVxVy;


AddVxVy.instructionRegex = "8..4";

},{"./../Hex":6,"./InstructionHandler":14}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AndVxVy = function (_InstructionHandler) {
    _inherits(AndVxVy, _InstructionHandler);

    function AndVxVy() {
        _classCallCheck(this, AndVxVy);

        return _possibleConstructorReturn(this, (AndVxVy.__proto__ || Object.getPrototypeOf(AndVxVy)).apply(this, arguments));
    }

    _createClass(AndVxVy, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            var vxValue = this.cpu.registers.read(opCode.hex(1));
            var vyValue = this.cpu.registers.read(opCode.hex(2));
            vxValue.and(vyValue);
        }
    }]);

    return AndVxVy;
}(_InstructionHandler3.default);

exports.default = AndVxVy;


AndVxVy.instructionRegex = "8..2";

},{"./InstructionHandler":14}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

var _Hex = require("./../Hex");

var _Hex2 = _interopRequireDefault(_Hex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CallAddr = function (_InstructionHandler) {
    _inherits(CallAddr, _InstructionHandler);

    function CallAddr() {
        _classCallCheck(this, CallAddr);

        return _possibleConstructorReturn(this, (CallAddr.__proto__ || Object.getPrototypeOf(CallAddr)).apply(this, arguments));
    }

    _createClass(CallAddr, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            var hexToStore = new _Hex2.default(this.cpu.pc.value);
            hexToStore.add(new _Hex2.default("02"));
            this.cpu.stack.put(hexToStore);
            this.cpu.pc.jumpTo(opCode.hex(1, 3));
        }
    }]);

    return CallAddr;
}(_InstructionHandler3.default);

exports.default = CallAddr;


CallAddr.instructionRegex = "2...";

},{"./../Hex":6,"./InstructionHandler":14}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Cls = function (_InstructionHandler) {
    _inherits(Cls, _InstructionHandler);

    function Cls() {
        _classCallCheck(this, Cls);

        return _possibleConstructorReturn(this, (Cls.__proto__ || Object.getPrototypeOf(Cls)).apply(this, arguments));
    }

    _createClass(Cls, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            this.cpu.screen.clear();
        }
    }]);

    return Cls;
}(_InstructionHandler3.default);

exports.default = Cls;


Cls.instructionRegex = "00e0";

},{"./InstructionHandler":14}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

var _Hex = require("./../Hex");

var _Hex2 = _interopRequireDefault(_Hex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrwVxVyNibble = function (_InstructionHandler) {
    _inherits(DrwVxVyNibble, _InstructionHandler);

    function DrwVxVyNibble() {
        _classCallCheck(this, DrwVxVyNibble);

        return _possibleConstructorReturn(this, (DrwVxVyNibble.__proto__ || Object.getPrototypeOf(DrwVxVyNibble)).apply(this, arguments));
    }

    _createClass(DrwVxVyNibble, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            var sprite = this.cpu.memory.readChunk(opCode.hex(3).toDec(), this.cpu.registerI);
            var x = this.cpu.registers.read(opCode.hex(1)).toDec();
            var y = this.cpu.registers.read(opCode.hex(2)).toDec();
            var collision = this.cpu.screen.displaySprite(x, y, sprite);
            this.cpu.registers.store(new _Hex2.default("f"), new _Hex2.default(collision ? "1" : "0"));
        }
    }]);

    return DrwVxVyNibble;
}(_InstructionHandler3.default);

exports.default = DrwVxVyNibble;


DrwVxVyNibble.instructionRegex = "d...";

},{"./../Hex":6,"./InstructionHandler":14}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InstructionHandler = function () {

    /**
     * @param {CPU} CpuService
     */
    function InstructionHandler(CpuService) {
        _classCallCheck(this, InstructionHandler);

        this.cpu = CpuService;
    }

    /**
     * @param {OpCode} opCode
     */


    _createClass(InstructionHandler, [{
        key: "execute",
        value: function execute(opCode) {
            throw new Error("Not yet implemented.");
        }
    }]);

    return InstructionHandler;
}();

exports.default = InstructionHandler;

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var JpAddr = function (_InstructionHandler) {
    _inherits(JpAddr, _InstructionHandler);

    function JpAddr() {
        _classCallCheck(this, JpAddr);

        return _possibleConstructorReturn(this, (JpAddr.__proto__ || Object.getPrototypeOf(JpAddr)).apply(this, arguments));
    }

    _createClass(JpAddr, [{
        key: "execute",

        /**
         *
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            this.cpu.pc.jumpTo(opCode.hex(1, 3));
        }
    }]);

    return JpAddr;
}(_InstructionHandler3.default);

exports.default = JpAddr;


JpAddr.instructionRegex = "1...";

},{"./InstructionHandler":14}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

var _Hex = require("./../Hex");

var _Hex2 = _interopRequireDefault(_Hex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var JpVoAddr = function (_InstructionHandler) {
    _inherits(JpVoAddr, _InstructionHandler);

    function JpVoAddr() {
        _classCallCheck(this, JpVoAddr);

        return _possibleConstructorReturn(this, (JpVoAddr.__proto__ || Object.getPrototypeOf(JpVoAddr)).apply(this, arguments));
    }

    _createClass(JpVoAddr, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            var v0Value = this.cpu.registers.read(new _Hex2.default("0"));
            this.cpu.pc.jumpTo(opCode.hex(1, 3).add(v0Value));
        }
    }]);

    return JpVoAddr;
}(_InstructionHandler3.default);

exports.default = JpVoAddr;


JpVoAddr.instructionRegex = "b...";

},{"./../Hex":6,"./InstructionHandler":14}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

var _Hex = require("./../Hex");

var _Hex2 = _interopRequireDefault(_Hex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LdBVx = function (_InstructionHandler) {
    _inherits(LdBVx, _InstructionHandler);

    function LdBVx() {
        _classCallCheck(this, LdBVx);

        return _possibleConstructorReturn(this, (LdBVx.__proto__ || Object.getPrototypeOf(LdBVx)).apply(this, arguments));
    }

    _createClass(LdBVx, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            var numberToStore = this.cpu.registers.read(opCode.hex(1)).toDec();
            var memoryLocation = this.cpu.registerI.copy();

            this.cpu.memory.storeByte(new _Hex2.default(Math.floor(numberToStore / 100)), memoryLocation);
            memoryLocation.increment();
            this.cpu.memory.storeByte(new _Hex2.default(Math.floor(numberToStore / 10 % 10)), memoryLocation);
            memoryLocation.increment();
            this.cpu.memory.storeByte(new _Hex2.default(Math.floor(numberToStore % 100 % 10)), memoryLocation);
        }
    }]);

    return LdBVx;
}(_InstructionHandler3.default);

exports.default = LdBVx;


LdBVx.instructionRegex = "f.33";

},{"./../Hex":6,"./InstructionHandler":14}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LdDtVx = function (_InstructionHandler) {
    _inherits(LdDtVx, _InstructionHandler);

    function LdDtVx() {
        _classCallCheck(this, LdDtVx);

        return _possibleConstructorReturn(this, (LdDtVx.__proto__ || Object.getPrototypeOf(LdDtVx)).apply(this, arguments));
    }

    _createClass(LdDtVx, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            this.cpu.delayTimer = this.cpu.registers.read(opCode.hex(1)).copy();
        }
    }]);

    return LdDtVx;
}(_InstructionHandler3.default);

exports.default = LdDtVx;


LdDtVx.instructionRegex = "f.15";

},{"./InstructionHandler":14}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LdFVx = function (_InstructionHandler) {
    _inherits(LdFVx, _InstructionHandler);

    function LdFVx() {
        _classCallCheck(this, LdFVx);

        return _possibleConstructorReturn(this, (LdFVx.__proto__ || Object.getPrototypeOf(LdFVx)).apply(this, arguments));
    }

    _createClass(LdFVx, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            this.cpu.registerI.value = (parseInt(this.cpu.registers.read(opCode.hex(1)).value, 16) * 5).toString(16);
        }
    }]);

    return LdFVx;
}(_InstructionHandler3.default);

exports.default = LdFVx;


LdFVx.instructionRegex = "f.29";

},{"./InstructionHandler":14}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LdIAddr = function (_InstructionHandler) {
    _inherits(LdIAddr, _InstructionHandler);

    function LdIAddr() {
        _classCallCheck(this, LdIAddr);

        return _possibleConstructorReturn(this, (LdIAddr.__proto__ || Object.getPrototypeOf(LdIAddr)).apply(this, arguments));
    }

    _createClass(LdIAddr, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            this.cpu.registerI.value = opCode.hex(1, 3).value;
        }
    }]);

    return LdIAddr;
}(_InstructionHandler3.default);

exports.default = LdIAddr;


LdIAddr.instructionRegex = "a...";

},{"./InstructionHandler":14}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

var _Hex = require("./../Hex");

var _Hex2 = _interopRequireDefault(_Hex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LdIVx = function (_InstructionHandler) {
    _inherits(LdIVx, _InstructionHandler);

    function LdIVx() {
        _classCallCheck(this, LdIVx);

        return _possibleConstructorReturn(this, (LdIVx.__proto__ || Object.getPrototypeOf(LdIVx)).apply(this, arguments));
    }

    _createClass(LdIVx, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            var decimalX = opCode.hex(1).toDec();
            var registerICopy = this.cpu.registerI.copy();

            for (var i = 0; i <= decimalX; i += 1) {
                var registerCopy = this.cpu.registers.read(new _Hex2.default(i.toString(16))).copy();
                this.cpu.memory.storeByte(registerCopy, registerICopy);
                // this.cpu.registerI.increment();
                registerICopy.increment();
            }
        }
    }]);

    return LdIVx;
}(_InstructionHandler3.default);

exports.default = LdIVx;


LdIVx.instructionRegex = "f.55";

},{"./../Hex":6,"./InstructionHandler":14}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LdStVx = function (_InstructionHandler) {
    _inherits(LdStVx, _InstructionHandler);

    function LdStVx() {
        _classCallCheck(this, LdStVx);

        return _possibleConstructorReturn(this, (LdStVx.__proto__ || Object.getPrototypeOf(LdStVx)).apply(this, arguments));
    }

    _createClass(LdStVx, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            this.cpu.soundTimer = this.cpu.registers.read(opCode.hex(1)).copy();
        }
    }]);

    return LdStVx;
}(_InstructionHandler3.default);

exports.default = LdStVx;


LdStVx.instructionRegex = "f.18";

},{"./InstructionHandler":14}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LdVxByte = function (_InstructionHandler) {
    _inherits(LdVxByte, _InstructionHandler);

    function LdVxByte() {
        _classCallCheck(this, LdVxByte);

        return _possibleConstructorReturn(this, (LdVxByte.__proto__ || Object.getPrototypeOf(LdVxByte)).apply(this, arguments));
    }

    _createClass(LdVxByte, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            this.cpu.registers.store(opCode.hex(1), opCode.hex(2, 2));
        }
    }]);

    return LdVxByte;
}(_InstructionHandler3.default);

exports.default = LdVxByte;


LdVxByte.instructionRegex = "6...";

},{"./InstructionHandler":14}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LdVxDt = function (_InstructionHandler) {
    _inherits(LdVxDt, _InstructionHandler);

    function LdVxDt() {
        _classCallCheck(this, LdVxDt);

        return _possibleConstructorReturn(this, (LdVxDt.__proto__ || Object.getPrototypeOf(LdVxDt)).apply(this, arguments));
    }

    _createClass(LdVxDt, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            this.cpu.registers.store(opCode.hex(1), this.cpu.delayTimer.copy());
        }
    }]);

    return LdVxDt;
}(_InstructionHandler3.default);

exports.default = LdVxDt;


LdVxDt.instructionRegex = "f.07";

},{"./InstructionHandler":14}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

var _Hex = require("./../Hex");

var _Hex2 = _interopRequireDefault(_Hex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LdVxI = function (_InstructionHandler) {
    _inherits(LdVxI, _InstructionHandler);

    function LdVxI() {
        _classCallCheck(this, LdVxI);

        return _possibleConstructorReturn(this, (LdVxI.__proto__ || Object.getPrototypeOf(LdVxI)).apply(this, arguments));
    }

    _createClass(LdVxI, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            var decimalX = opCode.hex(1).toDec();
            var registerICopy = this.cpu.registerI.copy();

            for (var i = 0; i <= decimalX; i += 1) {
                var memoryCopy = this.cpu.memory.readByte(registerICopy).copy();
                memoryCopy.toRegister();
                this.cpu.registers.store(new _Hex2.default(i.toString(16)), memoryCopy);
                registerICopy.increment();
            }
        }
    }]);

    return LdVxI;
}(_InstructionHandler3.default);

exports.default = LdVxI;


LdVxI.instructionRegex = "f.65";

},{"./../Hex":6,"./InstructionHandler":14}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

var _Hex = require("./../Hex");

var _Hex2 = _interopRequireDefault(_Hex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LdVxK = function (_InstructionHandler) {
    _inherits(LdVxK, _InstructionHandler);

    function LdVxK() {
        _classCallCheck(this, LdVxK);

        return _possibleConstructorReturn(this, (LdVxK.__proto__ || Object.getPrototypeOf(LdVxK)).apply(this, arguments));
    }

    _createClass(LdVxK, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            var _this2 = this;

            this.cpu.wait = true;
            this.cpu.keyboard.onDown(function (key) {
                _this2.buttonDown(opCode, key);
                _this2.cpu.wait = false;
            });
        }

        /**
         * @param {OpCode} opCode
         * @param {Key} key
         */

    }, {
        key: "buttonDown",
        value: function buttonDown(opCode, key) {
            this.cpu.registers.store(opCode.hex(1), new _Hex2.default(key.chip8Name));
        }
    }]);

    return LdVxK;
}(_InstructionHandler3.default);

exports.default = LdVxK;


LdVxK.instructionRegex = "f.0a";

},{"./../Hex":6,"./InstructionHandler":14}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

var _Hex = require("./../Hex");

var _Hex2 = _interopRequireDefault(_Hex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LdVxVy = function (_InstructionHandler) {
    _inherits(LdVxVy, _InstructionHandler);

    function LdVxVy() {
        _classCallCheck(this, LdVxVy);

        return _possibleConstructorReturn(this, (LdVxVy.__proto__ || Object.getPrototypeOf(LdVxVy)).apply(this, arguments));
    }

    _createClass(LdVxVy, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            this.cpu.registers.store(opCode.hex(1), this.cpu.registers.read(opCode.hex(2)).copy());
        }
    }]);

    return LdVxVy;
}(_InstructionHandler3.default);

exports.default = LdVxVy;


LdVxVy.instructionRegex = "8..0";

},{"./../Hex":6,"./InstructionHandler":14}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OrVxVy = function (_InstructionHandler) {
    _inherits(OrVxVy, _InstructionHandler);

    function OrVxVy() {
        _classCallCheck(this, OrVxVy);

        return _possibleConstructorReturn(this, (OrVxVy.__proto__ || Object.getPrototypeOf(OrVxVy)).apply(this, arguments));
    }

    _createClass(OrVxVy, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            var vxValue = this.cpu.registers.read(opCode.hex(1));
            var vyValue = this.cpu.registers.read(opCode.hex(2));
            vxValue.or(vyValue);
        }
    }]);

    return OrVxVy;
}(_InstructionHandler3.default);

exports.default = OrVxVy;


OrVxVy.instructionRegex = "8..1";

},{"./InstructionHandler":14}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

var _Hex = require("./../Hex");

var _Hex2 = _interopRequireDefault(_Hex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Ret = function (_InstructionHandler) {
    _inherits(Ret, _InstructionHandler);

    function Ret() {
        _classCallCheck(this, Ret);

        return _possibleConstructorReturn(this, (Ret.__proto__ || Object.getPrototypeOf(Ret)).apply(this, arguments));
    }

    _createClass(Ret, [{
        key: "execute",
        value: function execute() {
            this.cpu.pc.jumpTo(new _Hex2.default(this.cpu.stack.retrieve().value));
        }
    }]);

    return Ret;
}(_InstructionHandler3.default);

exports.default = Ret;


Ret.instructionRegex = "00ee";

},{"./../Hex":6,"./InstructionHandler":14}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

var _Hex = require("./../Hex");

var _Hex2 = _interopRequireDefault(_Hex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RndVxByte = function (_InstructionHandler) {
    _inherits(RndVxByte, _InstructionHandler);

    function RndVxByte() {
        _classCallCheck(this, RndVxByte);

        return _possibleConstructorReturn(this, (RndVxByte.__proto__ || Object.getPrototypeOf(RndVxByte)).apply(this, arguments));
    }

    _createClass(RndVxByte, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            var vxValue = this.cpu.registers.read(opCode.hex(1, 1));
            var kk = opCode.hex(2, 2);
            var random = _Hex2.default.random(new _Hex2.default("ff"));
            random.and(kk);
            vxValue.value = random.value;
        }
    }]);

    return RndVxByte;
}(_InstructionHandler3.default);

exports.default = RndVxByte;


RndVxByte.instructionRegex = "c...";

},{"./../Hex":6,"./InstructionHandler":14}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SeVxByte = function (_InstructionHandler) {
    _inherits(SeVxByte, _InstructionHandler);

    function SeVxByte() {
        _classCallCheck(this, SeVxByte);

        return _possibleConstructorReturn(this, (SeVxByte.__proto__ || Object.getPrototypeOf(SeVxByte)).apply(this, arguments));
    }

    _createClass(SeVxByte, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            var registerValue = this.cpu.registers.read(opCode.hex(1));
            if (registerValue.isEqualTo(opCode.hex(2, 2))) {
                this.cpu.pc.skipInstruction();
            }
        }
    }]);

    return SeVxByte;
}(_InstructionHandler3.default);

exports.default = SeVxByte;


SeVxByte.instructionRegex = "3...";

},{"./InstructionHandler":14}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SeVxVy = function (_InstructionHandler) {
    _inherits(SeVxVy, _InstructionHandler);

    function SeVxVy() {
        _classCallCheck(this, SeVxVy);

        return _possibleConstructorReturn(this, (SeVxVy.__proto__ || Object.getPrototypeOf(SeVxVy)).apply(this, arguments));
    }

    _createClass(SeVxVy, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            var xRegisterValue = this.cpu.registers.read(opCode.hex(1));
            var yRegisterValue = this.cpu.registers.read(opCode.hex(2));
            if (xRegisterValue.isEqualTo(yRegisterValue)) {
                this.cpu.pc.skipInstruction();
            }
        }
    }]);

    return SeVxVy;
}(_InstructionHandler3.default);

exports.default = SeVxVy;


SeVxVy.instructionRegex = "5..0";

},{"./InstructionHandler":14}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

var _Hex = require("./../Hex");

var _Hex2 = _interopRequireDefault(_Hex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ShlVxVy = function (_InstructionHandler) {
    _inherits(ShlVxVy, _InstructionHandler);

    function ShlVxVy() {
        _classCallCheck(this, ShlVxVy);

        return _possibleConstructorReturn(this, (ShlVxVy.__proto__ || Object.getPrototypeOf(ShlVxVy)).apply(this, arguments));
    }

    _createClass(ShlVxVy, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            var vxValue = this.cpu.registers.read(opCode.hex(1));
            var mostSignificantBit = new _Hex2.default((vxValue.toDec() & 0x80) === 0 ? "0" : "1");
            this.cpu.registers.store(new _Hex2.default("f"), mostSignificantBit);

            vxValue.multiplyByTwo(true);
        }
    }]);

    return ShlVxVy;
}(_InstructionHandler3.default);

exports.default = ShlVxVy;


ShlVxVy.instructionRegex = "8..e";

},{"./../Hex":6,"./InstructionHandler":14}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

var _Hex = require("./../Hex");

var _Hex2 = _interopRequireDefault(_Hex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ShrVxVy = function (_InstructionHandler) {
    _inherits(ShrVxVy, _InstructionHandler);

    function ShrVxVy() {
        _classCallCheck(this, ShrVxVy);

        return _possibleConstructorReturn(this, (ShrVxVy.__proto__ || Object.getPrototypeOf(ShrVxVy)).apply(this, arguments));
    }

    _createClass(ShrVxVy, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            var vxValue = this.cpu.registers.read(opCode.hex(1));
            this.cpu.registers.store(new _Hex2.default("f"), new _Hex2.default((vxValue.toDec() & 0x01).toString(16)));

            vxValue.divideByTwo(true);
        }
    }]);

    return ShrVxVy;
}(_InstructionHandler3.default);

exports.default = ShrVxVy;


ShrVxVy.instructionRegex = "8..6";

},{"./../Hex":6,"./InstructionHandler":14}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SknpVx = function (_InstructionHandler) {
    _inherits(SknpVx, _InstructionHandler);

    function SknpVx() {
        _classCallCheck(this, SknpVx);

        return _possibleConstructorReturn(this, (SknpVx.__proto__ || Object.getPrototypeOf(SknpVx)).apply(this, arguments));
    }

    _createClass(SknpVx, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            if (!this.cpu.keyboard.isDown(this.cpu.registers.read(opCode.hex(1)).realValue())) {
                this.cpu.pc.skipInstruction();
            }
        }
    }]);

    return SknpVx;
}(_InstructionHandler3.default);

exports.default = SknpVx;


SknpVx.instructionRegex = "e.a1";

},{"./InstructionHandler":14}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SkpVx = function (_InstructionHandler) {
    _inherits(SkpVx, _InstructionHandler);

    function SkpVx() {
        _classCallCheck(this, SkpVx);

        return _possibleConstructorReturn(this, (SkpVx.__proto__ || Object.getPrototypeOf(SkpVx)).apply(this, arguments));
    }

    _createClass(SkpVx, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            if (this.cpu.keyboard.isDown(this.cpu.registers.read(opCode.hex(1)).realValue())) {
                this.cpu.pc.skipInstruction();
            }
        }
    }]);

    return SkpVx;
}(_InstructionHandler3.default);

exports.default = SkpVx;


SkpVx.instructionRegex = "e.9e";

},{"./InstructionHandler":14}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SneVxByte = function (_InstructionHandler) {
    _inherits(SneVxByte, _InstructionHandler);

    function SneVxByte() {
        _classCallCheck(this, SneVxByte);

        return _possibleConstructorReturn(this, (SneVxByte.__proto__ || Object.getPrototypeOf(SneVxByte)).apply(this, arguments));
    }

    _createClass(SneVxByte, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            var registerValue = this.cpu.registers.read(opCode.hex(1));
            if (!registerValue.isEqualTo(opCode.hex(2, 2))) {
                this.cpu.pc.skipInstruction();
            }
        }
    }]);

    return SneVxByte;
}(_InstructionHandler3.default);

exports.default = SneVxByte;


SneVxByte.instructionRegex = "4...";

},{"./InstructionHandler":14}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SneVxVy = function (_InstructionHandler) {
    _inherits(SneVxVy, _InstructionHandler);

    function SneVxVy() {
        _classCallCheck(this, SneVxVy);

        return _possibleConstructorReturn(this, (SneVxVy.__proto__ || Object.getPrototypeOf(SneVxVy)).apply(this, arguments));
    }

    _createClass(SneVxVy, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            var vxValue = this.cpu.registers.read(opCode.hex(1));
            var vyValue = this.cpu.registers.read(opCode.hex(2));
            if (!vxValue.isEqualTo(vyValue)) {
                this.cpu.pc.skipInstruction();
            }
        }
    }]);

    return SneVxVy;
}(_InstructionHandler3.default);

exports.default = SneVxVy;


SneVxVy.instructionRegex = "9..0";

},{"./InstructionHandler":14}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

var _Hex = require("./../Hex");

var _Hex2 = _interopRequireDefault(_Hex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SubVxVy = function (_InstructionHandler) {
    _inherits(SubVxVy, _InstructionHandler);

    function SubVxVy() {
        _classCallCheck(this, SubVxVy);

        return _possibleConstructorReturn(this, (SubVxVy.__proto__ || Object.getPrototypeOf(SubVxVy)).apply(this, arguments));
    }

    _createClass(SubVxVy, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            var vxValue = this.cpu.registers.read(opCode.hex(1));
            var vyValue = this.cpu.registers.read(opCode.hex(2));

            var carry = vxValue.subtract(vyValue, true);
            carry = carry ? new _Hex2.default("1") : new _Hex2.default("0");
            this.cpu.registers.store(new _Hex2.default("f"), carry);
        }
    }]);

    return SubVxVy;
}(_InstructionHandler3.default);

exports.default = SubVxVy;


SubVxVy.instructionRegex = "8..5";

},{"./../Hex":6,"./InstructionHandler":14}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

var _Hex = require("./../Hex");

var _Hex2 = _interopRequireDefault(_Hex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SubnVxVy = function (_InstructionHandler) {
    _inherits(SubnVxVy, _InstructionHandler);

    function SubnVxVy() {
        _classCallCheck(this, SubnVxVy);

        return _possibleConstructorReturn(this, (SubnVxVy.__proto__ || Object.getPrototypeOf(SubnVxVy)).apply(this, arguments));
    }

    _createClass(SubnVxVy, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            var vxValue = this.cpu.registers.read(opCode.hex(1));
            var vyValue = this.cpu.registers.read(opCode.hex(2));
            var copiedVy = vyValue.copy();

            var carry = copiedVy.subtract(vxValue, true);
            carry = carry ? new _Hex2.default("1") : new _Hex2.default("0");
            this.cpu.registers.store(new _Hex2.default("f"), carry);

            vxValue.value = copiedVy.value;
        }
    }]);

    return SubnVxVy;
}(_InstructionHandler3.default);

exports.default = SubnVxVy;


SubnVxVy.instructionRegex = "8..7";

},{"./../Hex":6,"./InstructionHandler":14}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _InstructionHandler2 = require("./InstructionHandler");

var _InstructionHandler3 = _interopRequireDefault(_InstructionHandler2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var XorVxVy = function (_InstructionHandler) {
    _inherits(XorVxVy, _InstructionHandler);

    function XorVxVy() {
        _classCallCheck(this, XorVxVy);

        return _possibleConstructorReturn(this, (XorVxVy.__proto__ || Object.getPrototypeOf(XorVxVy)).apply(this, arguments));
    }

    _createClass(XorVxVy, [{
        key: "execute",


        /**
         * @param {OpCode} opCode
         */
        value: function execute(opCode) {
            var vxValue = this.cpu.registers.read(opCode.hex(1));
            var vyValue = this.cpu.registers.read(opCode.hex(2));
            vxValue.xor(vyValue);
        }
    }]);

    return XorVxVy;
}(_InstructionHandler3.default);

exports.default = XorVxVy;


XorVxVy.instructionRegex = "8..3";

},{"./InstructionHandler":14}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Cls = require("./Cls");

var _Cls2 = _interopRequireDefault(_Cls);

var _Ret = require("./Ret");

var _Ret2 = _interopRequireDefault(_Ret);

var _JpAddr = require("./JpAddr");

var _JpAddr2 = _interopRequireDefault(_JpAddr);

var _CallAddr = require("./CallAddr");

var _CallAddr2 = _interopRequireDefault(_CallAddr);

var _SeVxByte = require("./SeVxByte");

var _SeVxByte2 = _interopRequireDefault(_SeVxByte);

var _SneVxByte = require("./SneVxByte");

var _SneVxByte2 = _interopRequireDefault(_SneVxByte);

var _SeVxVy = require("./SeVxVy");

var _SeVxVy2 = _interopRequireDefault(_SeVxVy);

var _LdVxByte = require("./LdVxByte");

var _LdVxByte2 = _interopRequireDefault(_LdVxByte);

var _AddVxByte = require("./AddVxByte");

var _AddVxByte2 = _interopRequireDefault(_AddVxByte);

var _LdVxVy = require("./LdVxVy");

var _LdVxVy2 = _interopRequireDefault(_LdVxVy);

var _OrVxVy = require("./OrVxVy");

var _OrVxVy2 = _interopRequireDefault(_OrVxVy);

var _AndVxVy = require("./AndVxVy");

var _AndVxVy2 = _interopRequireDefault(_AndVxVy);

var _XorVxVy = require("./XorVxVy");

var _XorVxVy2 = _interopRequireDefault(_XorVxVy);

var _AddVxVy = require("./AddVxVy");

var _AddVxVy2 = _interopRequireDefault(_AddVxVy);

var _SubVxVy = require("./SubVxVy");

var _SubVxVy2 = _interopRequireDefault(_SubVxVy);

var _ShrVxVy = require("./ShrVxVy");

var _ShrVxVy2 = _interopRequireDefault(_ShrVxVy);

var _SubnVxVy = require("./SubnVxVy");

var _SubnVxVy2 = _interopRequireDefault(_SubnVxVy);

var _ShlVxVy = require("./ShlVxVy");

var _ShlVxVy2 = _interopRequireDefault(_ShlVxVy);

var _SneVxVy = require("./SneVxVy");

var _SneVxVy2 = _interopRequireDefault(_SneVxVy);

var _LdIAddr = require("./LdIAddr");

var _LdIAddr2 = _interopRequireDefault(_LdIAddr);

var _JpVoAddr = require("./JpVoAddr");

var _JpVoAddr2 = _interopRequireDefault(_JpVoAddr);

var _RndVxByte = require("./RndVxByte");

var _RndVxByte2 = _interopRequireDefault(_RndVxByte);

var _DrwVxVyNibble = require("./DrwVxVyNibble");

var _DrwVxVyNibble2 = _interopRequireDefault(_DrwVxVyNibble);

var _SkpVx = require("./SkpVx");

var _SkpVx2 = _interopRequireDefault(_SkpVx);

var _SknpVx = require("./SknpVx");

var _SknpVx2 = _interopRequireDefault(_SknpVx);

var _LdVxDt = require("./LdVxDt");

var _LdVxDt2 = _interopRequireDefault(_LdVxDt);

var _LdVxK = require("./LdVxK");

var _LdVxK2 = _interopRequireDefault(_LdVxK);

var _LdDtVx = require("./LdDtVx");

var _LdDtVx2 = _interopRequireDefault(_LdDtVx);

var _LdStVx = require("./LdStVx");

var _LdStVx2 = _interopRequireDefault(_LdStVx);

var _AddIVx = require("./AddIVx");

var _AddIVx2 = _interopRequireDefault(_AddIVx);

var _LdFVx = require("./LdFVx");

var _LdFVx2 = _interopRequireDefault(_LdFVx);

var _LdBVx = require("./LdBVx");

var _LdBVx2 = _interopRequireDefault(_LdBVx);

var _LdIVx = require("./LdIVx");

var _LdIVx2 = _interopRequireDefault(_LdIVx);

var _LdVxI = require("./LdVxI");

var _LdVxI2 = _interopRequireDefault(_LdVxI);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = [_Cls2.default, _Ret2.default, _JpAddr2.default, _CallAddr2.default, _SeVxByte2.default, _SneVxByte2.default, _SeVxVy2.default, _LdVxByte2.default, _AddVxByte2.default, _LdVxVy2.default, _OrVxVy2.default, _AndVxVy2.default, _XorVxVy2.default, _AddVxVy2.default, _SubVxVy2.default, _ShrVxVy2.default, _SubnVxVy2.default, _ShlVxVy2.default, _SneVxVy2.default, _LdIAddr2.default, _JpVoAddr2.default, _RndVxByte2.default, _DrwVxVyNibble2.default, _SkpVx2.default, _SknpVx2.default, _LdVxDt2.default, _LdVxK2.default, _LdDtVx2.default, _LdStVx2.default, _AddIVx2.default, _LdFVx2.default, _LdBVx2.default, _LdIVx2.default, _LdVxI2.default];

},{"./AddIVx":7,"./AddVxByte":8,"./AddVxVy":9,"./AndVxVy":10,"./CallAddr":11,"./Cls":12,"./DrwVxVyNibble":13,"./JpAddr":15,"./JpVoAddr":16,"./LdBVx":17,"./LdDtVx":18,"./LdFVx":19,"./LdIAddr":20,"./LdIVx":21,"./LdStVx":22,"./LdVxByte":23,"./LdVxDt":24,"./LdVxI":25,"./LdVxK":26,"./LdVxVy":27,"./OrVxVy":28,"./Ret":29,"./RndVxByte":30,"./SeVxByte":31,"./SeVxVy":32,"./ShlVxVy":33,"./ShrVxVy":34,"./SknpVx":35,"./SkpVx":36,"./SneVxByte":37,"./SneVxVy":38,"./SubVxVy":39,"./SubnVxVy":40,"./XorVxVy":41}],43:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var STATE = {
    UP: 0,
    DOWN: 1
};

var Key = function () {
    function Key(chip8Name, keyboardName) {
        _classCallCheck(this, Key);

        this.chip8Name = chip8Name;
        this.keyboardName = keyboardName;
        this.state = STATE.UP;
    }

    /**
     * This method can be extended to provide multiple keyboard keys support mapped
     * to single chip8 key.
     * @param keyboardKeyName
     * @returns {boolean}
     */


    _createClass(Key, [{
        key: "isKeyMapped",
        value: function isKeyMapped(keyboardKeyName) {
            return this.keyboardName == keyboardKeyName;
        }
    }, {
        key: "down",
        value: function down() {
            this.state = STATE.DOWN;
        }
    }, {
        key: "up",
        value: function up() {
            this.state = STATE.UP;
        }
    }, {
        key: "isUp",
        value: function isUp() {
            return this.state == STATE.UP;
        }
    }, {
        key: "isDown",
        value: function isDown() {
            return this.state == STATE.DOWN;
        }
    }]);

    return Key;
}();

exports.default = Key;

},{}],44:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.keysSet = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Key = require("./Key");

var _Key2 = _interopRequireDefault(_Key);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var keysSet = new Set([new _Key2.default("1", "1"), new _Key2.default("2", "2"), new _Key2.default("3", "3"), new _Key2.default("c", "4"), new _Key2.default("4", "q"), new _Key2.default("5", "w"), new _Key2.default("6", "e"), new _Key2.default("d", "r"), new _Key2.default("7", "a"), new _Key2.default("8", "s"), new _Key2.default("9", "d"), new _Key2.default("e", "f"), new _Key2.default("a", "z"), new _Key2.default("0", "x"), new _Key2.default("b", "c"), new _Key2.default("f", "v")]);

exports.keysSet = keysSet;

var Map = function () {
    function Map() {
        _classCallCheck(this, Map);
    }

    _createClass(Map, [{
        key: "keyDown",
        value: function keyDown(keyboardKeyName) {
            var keyObject = this.keyByKeyboardName(keyboardKeyName);
            if (keyObject !== false) {
                keyObject.down();
            }
            return keyObject;
        }
    }, {
        key: "keyUp",
        value: function keyUp(keyboardKeyName) {
            var keyObject = this.keyByKeyboardName(keyboardKeyName);
            if (keyObject !== false) {
                keyObject.up();
            }
            return keyObject;
        }
    }, {
        key: "isDown",
        value: function isDown(chip8Name) {
            var keyObject = this.keyByChip8Name(chip8Name);
            if (keyObject !== false) {
                return keyObject.isDown();
            }
            return false;
        }
    }, {
        key: "isUp",
        value: function isUp(chip8Name) {
            var keyObject = this.keyByChip8Name(chip8Name);
            if (keyObject !== false) {
                return keyObject.isUp();
            }
            return false;
        }
    }, {
        key: "keyByKeyboardName",
        value: function keyByKeyboardName(keyboardKeyName) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {

                for (var _iterator = keysSet[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var key = _step.value;

                    if (key.isKeyMapped(keyboardKeyName)) {
                        return key;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return false;
        }
    }, {
        key: "keyByChip8Name",
        value: function keyByChip8Name(name) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = keysSet[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var key = _step2.value;

                    if (key.chip8Name == name) {
                        return key;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }]);

    return Map;
}();

exports.default = Map;

},{"./Key":43}],45:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Hex2 = require("./Hex");

var _Hex3 = _interopRequireDefault(_Hex2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OpCode = function (_Hex) {
    _inherits(OpCode, _Hex);

    function OpCode() {
        _classCallCheck(this, OpCode);

        return _possibleConstructorReturn(this, (OpCode.__proto__ || Object.getPrototypeOf(OpCode)).apply(this, arguments));
    }

    _createClass(OpCode, [{
        key: "hex",
        value: function hex(position) {
            var nibblesToRead = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            return new _Hex3.default(this.value.substring(position, position + nibblesToRead));
        }
    }], [{
        key: "fromMemoryChunk",
        value: function fromMemoryChunk(data) {
            return new OpCode(data[0].value + data[1].value);
        }
    }]);

    return OpCode;
}(_Hex3.default);

exports.default = OpCode;

},{"./Hex":6}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Hex2 = require("./Hex");

var _Hex3 = _interopRequireDefault(_Hex2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PC = function (_Hex) {
    _inherits(PC, _Hex);

    function PC(value) {
        _classCallCheck(this, PC);

        var _this = _possibleConstructorReturn(this, (PC.__proto__ || Object.getPrototypeOf(PC)).call(this, value));

        _this.jumped = false;
        return _this;
    }

    _createClass(PC, [{
        key: "nextInstruction",
        value: function nextInstruction() {
            this.add(new _Hex3.default("02"));
        }
    }, {
        key: "skipInstruction",
        value: function skipInstruction() {
            this.add(new _Hex3.default("04"));
            this.jumped = true;
        }

        /**
         * @param {Hex} hex
         */

    }, {
        key: "jumpTo",
        value: function jumpTo(hex) {
            this.value = hex.value;
            this.jumped = true;
        }
    }, {
        key: "jumpedFlag",
        value: function jumpedFlag() {
            return this.jumped;
        }
    }, {
        key: "resetJumpedFlag",
        value: function resetJumpedFlag() {
            this.jumped = false;
        }
    }]);

    return PC;
}(_Hex3.default);

exports.default = PC;

},{"./Hex":6}],47:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _loader = require("./../Generic/InstructionHandlers/loader");

var _loader2 = _interopRequireDefault(_loader);

var _Hex = require("./../Generic/Hex");

var _Hex2 = _interopRequireDefault(_Hex);

var _PC = require("./../Generic/PC");

var _PC2 = _interopRequireDefault(_PC);

var _OpCode = require("./../Generic/OpCode");

var _OpCode2 = _interopRequireDefault(_OpCode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @property {Stack} stack
 * @property {PC} pc
 * @property {Memory} memory
 * @property {Registers} registers
 * @property {Keyboard} keyboard
 * @property {Screen} screen
 */
var CPU = function () {

    /**
     *
     * @param {Memory} MemoryService
     * @param {Stack} StackService
     * @param {Registers} RegistersService
     * @param {Keyboard} KeyboardService
     * @param {Screen} ScreenService
     * @param {Speaker} SpeakerService
     * @param {Settings} SettingsService
     */
    function CPU(MemoryService, StackService, RegistersService, KeyboardService, ScreenService, SpeakerService, SettingsService) {
        _classCallCheck(this, CPU);

        this.keyboard = KeyboardService;
        this.memory = MemoryService;
        this.stack = StackService;
        this.registers = RegistersService;
        this.screen = ScreenService;
        this.speaker = SpeakerService;
        this.settings = SettingsService;
        this.reset();
    }

    _createClass(CPU, [{
        key: "nextInstruction",
        value: function nextInstruction() {
            if (this.wait) {
                return true;
            }
            this.executing = true;
            if (this.pc.jumpedFlag()) {
                this.pc.resetJumpedFlag();
            } else {
                this.pc.nextInstruction();
            }
            this.opCode = _OpCode2.default.fromMemoryChunk(this.memory.readChunk(2, this.pc));
            var instructionHandler = this.findInstructionHandler(this.opCode);
            if (instructionHandler !== false) {
                new instructionHandler(this).execute(this.opCode);
                this.nextOpCode = this.readNextOpCode();
            } else {
                return false;
            }
            return true;
        }
    }, {
        key: "readNextOpCode",
        value: function readNextOpCode() {
            var copy = this.pc.copy();
            if (!this.pc.jumpedFlag()) {
                copy.add(new _Hex2.default("02"));
            }
            return _OpCode2.default.fromMemoryChunk(this.memory.readChunk(2, copy));
        }
    }, {
        key: "animationFrame",
        value: function animationFrame() {
            if (this.delayTimer.toDec() > 0) {
                this.delayTimer.decrement();
            }
            if (this.soundTimer.toDec() > 0) {
                if (this.settings.sound) {
                    this.speaker.start();
                }
                this.soundTimer.decrement();
            } else {
                this.speaker.stop();
            }
        }

        /**
         * @param {OpCode} opCode
         * @return {InstructionHandler|Boolean}
         */

    }, {
        key: "findInstructionHandler",
        value: function findInstructionHandler(opCode) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = _loader2.default[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var handler = _step.value;

                    if (opCode.value.match(handler.instructionRegex)) {
                        return handler;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return false;
        }

        /**
         * Resets CPU to initial state
         */

    }, {
        key: "reset",
        value: function reset() {
            this.softReset();
            this.memory.reset();
        }

        /**
         * Resets CPU to initial state without clearing memory
         */

    }, {
        key: "softReset",
        value: function softReset() {
            this.executing = false;
            this.registerI = new _Hex2.default("0");
            this.pc = new _PC2.default("0");
            this.delayTimer = new _Hex2.default("0");
            this.soundTimer = new _Hex2.default("0");
            this.wait = false;

            this.stack.reset();
            this.registers.reset();
            this.screen.clear();
        }
    }]);

    return CPU;
}();

exports.default = CPU;

},{"./../Generic/Hex":6,"./../Generic/InstructionHandlers/loader":42,"./../Generic/OpCode":45,"./../Generic/PC":46}],48:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Map = require("./../Generic/Keyboard/Map");

var _Map2 = _interopRequireDefault(_Map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Keyboard = function () {
    function Keyboard() {
        _classCallCheck(this, Keyboard);

        this.map = new _Map2.default();
        this.registerKeyDownEvents();
        this.registerKeyUpEvents();
        this.watcher = false;
    }

    _createClass(Keyboard, [{
        key: "registerKeyDownEvents",
        value: function registerKeyDownEvents() {
            var _this = this;

            document.addEventListener("keydown", function (event) {
                var keyName = event.key;

                if (_this.map.keyDown(keyName) && _this.watcher) {
                    _this.watcher(_this.map.keyByKeyboardName(keyName));
                    _this.watcher = false;
                }
            }, false);
        }
    }, {
        key: "registerKeyUpEvents",
        value: function registerKeyUpEvents() {
            var _this2 = this;

            document.addEventListener("keyup", function (event) {
                var keyName = event.key;
                _this2.map.keyUp(keyName);
            }, false);
        }
    }, {
        key: "isDown",
        value: function isDown(chip8KeyName) {
            return this.map.isDown(chip8KeyName);
        }
    }, {
        key: "isUp",
        value: function isUp(chip8KeyName) {
            return this.map.isUp(chip8KeyName);
        }
    }, {
        key: "onDown",
        value: function onDown(callable) {
            this.watcher = callable;
        }
    }]);

    return Keyboard;
}();

exports.default = Keyboard;

},{"./../Generic/Keyboard/Map":44}],49:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Hex = require("./../Generic/Hex");

var _Hex2 = _interopRequireDefault(_Hex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Memory = function () {
    function Memory() {
        _classCallCheck(this, Memory);

        this.reset();
    }

    _createClass(Memory, [{
        key: "reset",
        value: function reset() {
            this.memory = [];
        }

        /**
         * @param bytesToRead
         * @param {Hex} position
         * @returns {Array}
         */

    }, {
        key: "readChunk",
        value: function readChunk(bytesToRead, position) {
            var dataRead = [];
            var currentPosition = position.copy();
            for (var i = 0; i < bytesToRead; i += 1, currentPosition.increment()) {
                dataRead[i] = this.readByte(currentPosition);
            }

            return dataRead;
        }

        /**
         * @param {Hex} position
         * @returns {Hex}
         */

    }, {
        key: "readByte",
        value: function readByte(position) {
            return this.memory[position.toDec()];
        }

        /**
         * @param bytesToStore
         * @param {Hex} position
         */

    }, {
        key: "storeChunk",
        value: function storeChunk(bytesToStore, position) {
            var currentPosition = new _Hex2.default(position.value);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = bytesToStore[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var byte = _step.value;

                    this.storeByte(byte, currentPosition);
                    currentPosition.increment();
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        /**
         * @param byte
         * @param {Hex} position
         */

    }, {
        key: "storeByte",
        value: function storeByte(byte, position) {
            if (!(byte instanceof _Hex2.default)) {
                byte = new _Hex2.default(byte);
            }
            this.memory[position.toDec()] = byte;
        }
    }]);

    return Memory;
}();

exports.default = Memory;

},{"./../Generic/Hex":6}],50:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Hex = require("./../Generic/Hex");

var _Hex2 = _interopRequireDefault(_Hex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Registers = function () {
    function Registers() {
        _classCallCheck(this, Registers);

        this.size = 16;
        this.registers = {};
        this.reset();
    }

    _createClass(Registers, [{
        key: "reset",
        value: function reset() {
            for (var i = 0; i < this.size; i += 1) {
                this.registers[i.toString(16)] = new _Hex2.default("0");
            }
        }

        /**
         *
         * @param {Hex} position
         * @returns {Hex}
         */

    }, {
        key: "read",
        value: function read(position) {
            if (!this.registers[position.lowestNibble()]) {
                console.log(position);
                console.log(this.registers[position.lowestNibble()]);
            }
            return this.registers[position.lowestNibble()];
        }

        /**
         * @param {Hex} position
         * @param {Hex} value
         */

    }, {
        key: "store",
        value: function store(position, value) {
            var copy = value.copy();
            copy.value = (parseInt(copy.value, 16) & 0xff).toString(16);
            this.registers[position.lowestNibble()] = copy;
        }
    }]);

    return Registers;
}();

exports.default = Registers;

},{"./../Generic/Hex":6}],51:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Hex = require("./../Generic/Hex");

var _Hex2 = _interopRequireDefault(_Hex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var startingPosition = 512;

var RoamLoader = function () {
    function RoamLoader($rootScope) {
        _classCallCheck(this, RoamLoader);

        this.$rootScope = $rootScope;
    }

    _createClass(RoamLoader, [{
        key: "bin2hex",
        value: function bin2hex(s) {
            //  discuss at: http://phpjs.org/functions/bin2hex/
            // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // bugfixed by: Onno Marsman
            // bugfixed by: Linuxworld
            // improved by: ntoniazzi (http://phpjs.org/functions/bin2hex:361#comment_177616)
            //   example 1: bin2hex('Kev');
            //   returns 1: '4b6576'
            //   example 2: bin2hex(String.fromCharCode(0x00));
            //   returns 2: '00'

            var i = void 0,
                l = void 0,
                o = "",
                n = void 0;

            s += "";

            for (i = 0, l = s.length; i < l; i++) {
                n = s.charCodeAt(i).toString(16);
                o += n.length < 2 ? "0" + n : n;
            }

            return o;
        }
    }, {
        key: "load",
        value: function load(game) {
            var _this = this;

            var rom = [],
                reader = new FileReader();

            reader.onerror = function (e) {
                _this.errorHandler(e);
            };

            reader.onprogress = function (e) {
                // this.updateProgress(e);
            };

            reader.onabort = function (e) {
                // alert('File read cancelled');
            };

            reader.onloadstart = function (e) {
                // console.log('loading file');
            };

            reader.onload = function (e) {
                for (var i = 0; i < reader.result.length; i += 1) {
                    rom[startingPosition + i] = new _Hex2.default(_this.bin2hex(reader.result.charAt(i)));
                }
                _this.$rootScope.$emit("gameAnalyzed", rom, game);
            };

            // Read in the image file as a binary string.
            reader.readAsBinaryString(game);
        }
    }, {
        key: "errorHandler",
        value: function errorHandler(e) {
            switch (e.target.error.code) {
                case e.target.error.NOT_FOUND_ERR:
                    alert("File Not Found!");
                    break;
                case e.target.error.NOT_READABLE_ERR:
                    alert("File is not readable");
                    break;
                case e.target.error.ABORT_ERR:
                    break; // noop
                default:
                    alert("An error occurred reading this file.");
            }
        }
    }]);

    return RoamLoader;
}();

exports.default = RoamLoader;

},{"./../Generic/Hex":6}],52:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var size = {
    x: 64,
    y: 32
};

var Screen = function () {
    function Screen($rootScope) {
        _classCallCheck(this, Screen);

        this.$rootScope = $rootScope;
        this.clear();
    }

    _createClass(Screen, [{
        key: "clear",
        value: function clear() {
            this.pixels = [];
            for (var i = 0; i < size.y; i += 1) {
                this.pixels.push(new Array(size.x).fill(0));
            }
            this.$rootScope.$emit("screenUpdated", this.pixels);
        }
    }, {
        key: "displaySprite",
        value: function displaySprite(x, y, sprite) {
            var collision = false;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = sprite[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var row = _step.value;

                    var binary = Number(parseInt(row.value, 16)).toString(2);
                    binary = "00000000".substr(binary.length) + binary;
                    collision = this.displayRow(x, y, binary) || collision;
                    y += 1;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.$rootScope.$emit("screenUpdated", this.pixels);
            return collision;
        }
    }, {
        key: "displayRow",
        value: function displayRow(x, y, row) {
            var collision = false;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = row[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var pixel = _step2.value;

                    collision = this.displayPixel(x, y, pixel) || collision;
                    x += 1;
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return collision;
        }
    }, {
        key: "displayPixel",
        value: function displayPixel(x, y, pixelToDraw) {
            pixelToDraw = parseInt(pixelToDraw);

            var collision = this.pixels[y % size.y][x % size.x] && pixelToDraw;
            this.pixels[y % size.y][x % size.x] ^= pixelToDraw;

            return collision;
        }
    }]);

    return Screen;
}();

exports.default = Screen;

},{}],53:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Settings = function Settings() {
    _classCallCheck(this, Settings);

    this.restrictSpeed = true;
    this.instructionsPerSecond = 100;
    this.sound = true;
};

exports.default = Settings;

},{}],54:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MODE = {
    HIDDEN: 0,
    SETTINGS: 1,
    DEBUG: 2
};

var SidePanel = function () {
    function SidePanel() {
        _classCallCheck(this, SidePanel);

        this.hide();
    }

    _createClass(SidePanel, [{
        key: "settings",
        value: function settings() {
            this.state = MODE.SETTINGS;
        }
    }, {
        key: "debug",
        value: function debug() {
            this.state = MODE.DEBUG;
        }
    }, {
        key: "isHidden",
        value: function isHidden() {
            return this.state == MODE.HIDDEN;
        }
    }, {
        key: "isShowingSettings",
        value: function isShowingSettings() {
            return this.state == MODE.SETTINGS;
        }
    }, {
        key: "isShowingDebug",
        value: function isShowingDebug() {
            return this.state == MODE.DEBUG;
        }
    }, {
        key: "hide",
        value: function hide() {
            this.state = MODE.HIDDEN;
        }
    }]);

    return SidePanel;
}();

exports.default = SidePanel;

},{}],55:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Speaker = function () {
    function Speaker() {
        _classCallCheck(this, Speaker);

        this.context = new AudioContext();
        this.isPlaying = false;
    }

    _createClass(Speaker, [{
        key: "start",
        value: function start() {
            if (!this.isPlaying) {
                this.isPlaying = true;
                this.oscillator = this.context.createOscillator();
                this.gain = this.context.createGain();
                this.oscillator.connect(this.gain);
                this.gain.connect(this.context.destination);
                this.oscillator.start(0);
            }
        }
    }, {
        key: "stop",
        value: function stop() {
            if (this.isPlaying) {
                this.isPlaying = false;
                this.gain.gain.exponentialRampToValueAtTime(0.00001, this.context.currentTime + 0.04);
            }
        }
    }]);

    return Speaker;
}();

exports.default = Speaker;

},{}],56:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Hex = require("./../Generic/Hex");

var _Hex2 = _interopRequireDefault(_Hex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stack = function () {
    function Stack() {
        _classCallCheck(this, Stack);

        this.size = 16;
        this.stack = {};
        this.pointer = new _Hex2.default("0");
        this.reset();
    }

    _createClass(Stack, [{
        key: "reset",
        value: function reset() {
            for (var i = 0; i < this.size; i += 1) {
                this.stack[i.toString(16)] = new _Hex2.default("0");
            }
            this.pointer = new _Hex2.default("0");
        }

        /**
         * @param {Hex} hex
         */

    }, {
        key: "put",
        value: function put(hex) {
            this.stack[this.pointer.value] = hex;
            this.pointer.increment();
        }

        /**
         * @returns {Hex}
         */

    }, {
        key: "retrieve",
        value: function retrieve() {
            this.pointer.decrement();
            return this.stack[this.pointer.value];
        }
    }]);

    return Stack;
}();

exports.default = Stack;

},{"./../Generic/Hex":6}],57:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _GameRunnerController = require("./Controllers/GameRunnerController");

var _GameRunnerController2 = _interopRequireDefault(_GameRunnerController);

var _Screen = require("./Services/Screen");

var _Screen2 = _interopRequireDefault(_Screen);

var _Keyboard = require("./Services/Keyboard");

var _Keyboard2 = _interopRequireDefault(_Keyboard);

var _Memory = require("./Services/Memory");

var _Memory2 = _interopRequireDefault(_Memory);

var _CPU = require("./Services/CPU");

var _CPU2 = _interopRequireDefault(_CPU);

var _Stack = require("./Services/Stack");

var _Stack2 = _interopRequireDefault(_Stack);

var _Registers = require("./Services/Registers");

var _Registers2 = _interopRequireDefault(_Registers);

var _RoamLoader = require("./Services/RoamLoader");

var _RoamLoader2 = _interopRequireDefault(_RoamLoader);

var _Speaker = require("./Services/Speaker");

var _Speaker2 = _interopRequireDefault(_Speaker);

var _Settings = require("./Services/Settings");

var _Settings2 = _interopRequireDefault(_Settings);

var _SidePanel = require("./Services/SidePanel");

var _SidePanel2 = _interopRequireDefault(_SidePanel);

var _ScreenDirective = require("./Directives/ScreenDirective");

var _ScreenDirective2 = _interopRequireDefault(_ScreenDirective);

var _LoadRoamDirective = require("./Directives/Buttons/LoadRoamDirective");

var _LoadRoamDirective2 = _interopRequireDefault(_LoadRoamDirective);

var _SidePanel3 = require("./Directives/SidePanel");

var _SidePanel4 = _interopRequireDefault(_SidePanel3);

var _KeypadDirective = require("./Directives/KeypadDirective");

var _KeypadDirective2 = _interopRequireDefault(_KeypadDirective);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {
    app.component("gameRunner", {
        templateUrl: "computer.html",
        controller: _GameRunnerController2.default
    });

    app.service("CpuService", _CPU2.default);
    app.service("KeyboardService", _Keyboard2.default);
    app.service("MemoryService", _Memory2.default);
    app.service("RegistersService", _Registers2.default);
    app.service("ScreenService", _Screen2.default);
    app.service("StackService", _Stack2.default);
    app.service("RoamLoaderService", _RoamLoader2.default);
    app.service("SpeakerService", _Speaker2.default);
    app.service("SettingsService", _Settings2.default);
    app.service("SidePanelService", _SidePanel2.default);

    app.directive("screen", function () {
        return new _ScreenDirective2.default();
    });

    app.directive("sidePanel", function () {
        return new _SidePanel4.default();
    });

    app.directive("loadRoam", ["RoamLoaderService", "CpuService", function (RoamLoaderService, CPU) {
        return new _LoadRoamDirective2.default(RoamLoaderService, CPU);
    }]);

    app.directive("keypad", function () {
        return new _KeypadDirective2.default();
    });
};

},{"./Controllers/GameRunnerController":1,"./Directives/Buttons/LoadRoamDirective":2,"./Directives/KeypadDirective":3,"./Directives/ScreenDirective":4,"./Directives/SidePanel":5,"./Services/CPU":47,"./Services/Keyboard":48,"./Services/Memory":49,"./Services/Registers":50,"./Services/RoamLoader":51,"./Services/Screen":52,"./Services/Settings":53,"./Services/SidePanel":54,"./Services/Speaker":55,"./Services/Stack":56}],58:[function(require,module,exports){
"use strict";

var _components = require("./components");

var _components2 = _interopRequireDefault(_components);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var chipEmulator = angular.module("chip8Emulator", []);

(0, _components2.default)(chipEmulator);

},{"./components":57}]},{},[58])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwYWNoZS9odGRvY3MvZW11bGF0b3JzL2NoaXA4L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLlxcLi5cXC4uXFxBcGFjaGVcXGh0ZG9jc1xcZW11bGF0b3JzXFxjaGlwOFxcc3JjXFxqc1xcQ29udHJvbGxlcnNcXEdhbWVSdW5uZXJDb250cm9sbGVyLmpzIiwiLi5cXC4uXFwuLlxcQXBhY2hlXFxodGRvY3NcXGVtdWxhdG9yc1xcY2hpcDhcXHNyY1xcanNcXERpcmVjdGl2ZXNcXEJ1dHRvbnNcXExvYWRSb2FtRGlyZWN0aXZlLmpzIiwiLi5cXC4uXFwuLlxcQXBhY2hlXFxodGRvY3NcXGVtdWxhdG9yc1xcY2hpcDhcXHNyY1xcanNcXERpcmVjdGl2ZXNcXEtleXBhZERpcmVjdGl2ZS5qcyIsIi4uXFwuLlxcLi5cXEFwYWNoZVxcaHRkb2NzXFxlbXVsYXRvcnNcXGNoaXA4XFxzcmNcXGpzXFxEaXJlY3RpdmVzXFxTY3JlZW5EaXJlY3RpdmUuanMiLCIuLlxcLi5cXC4uXFxBcGFjaGVcXGh0ZG9jc1xcZW11bGF0b3JzXFxjaGlwOFxcc3JjXFxqc1xcRGlyZWN0aXZlc1xcU2lkZVBhbmVsLmpzIiwiLi5cXC4uXFwuLlxcQXBhY2hlXFxodGRvY3NcXGVtdWxhdG9yc1xcY2hpcDhcXHNyY1xcanNcXEdlbmVyaWNcXEhleC5qcyIsIi4uXFwuLlxcLi5cXEFwYWNoZVxcaHRkb2NzXFxlbXVsYXRvcnNcXGNoaXA4XFxzcmNcXGpzXFxHZW5lcmljXFxJbnN0cnVjdGlvbkhhbmRsZXJzXFxBZGRJVnguanMiLCIuLlxcLi5cXC4uXFxBcGFjaGVcXGh0ZG9jc1xcZW11bGF0b3JzXFxjaGlwOFxcc3JjXFxqc1xcR2VuZXJpY1xcSW5zdHJ1Y3Rpb25IYW5kbGVyc1xcQWRkVnhCeXRlLmpzIiwiLi5cXC4uXFwuLlxcQXBhY2hlXFxodGRvY3NcXGVtdWxhdG9yc1xcY2hpcDhcXHNyY1xcanNcXEdlbmVyaWNcXEluc3RydWN0aW9uSGFuZGxlcnNcXEFkZFZ4VnkuanMiLCIuLlxcLi5cXC4uXFxBcGFjaGVcXGh0ZG9jc1xcZW11bGF0b3JzXFxjaGlwOFxcc3JjXFxqc1xcR2VuZXJpY1xcSW5zdHJ1Y3Rpb25IYW5kbGVyc1xcQW5kVnhWeS5qcyIsIi4uXFwuLlxcLi5cXEFwYWNoZVxcaHRkb2NzXFxlbXVsYXRvcnNcXGNoaXA4XFxzcmNcXGpzXFxHZW5lcmljXFxJbnN0cnVjdGlvbkhhbmRsZXJzXFxDYWxsQWRkci5qcyIsIi4uXFwuLlxcLi5cXEFwYWNoZVxcaHRkb2NzXFxlbXVsYXRvcnNcXGNoaXA4XFxzcmNcXGpzXFxHZW5lcmljXFxJbnN0cnVjdGlvbkhhbmRsZXJzXFxDbHMuanMiLCIuLlxcLi5cXC4uXFxBcGFjaGVcXGh0ZG9jc1xcZW11bGF0b3JzXFxjaGlwOFxcc3JjXFxqc1xcR2VuZXJpY1xcSW5zdHJ1Y3Rpb25IYW5kbGVyc1xcRHJ3VnhWeU5pYmJsZS5qcyIsIi4uXFwuLlxcLi5cXEFwYWNoZVxcaHRkb2NzXFxlbXVsYXRvcnNcXGNoaXA4XFxzcmNcXGpzXFxHZW5lcmljXFxJbnN0cnVjdGlvbkhhbmRsZXJzXFxJbnN0cnVjdGlvbkhhbmRsZXIuanMiLCIuLlxcLi5cXC4uXFxBcGFjaGVcXGh0ZG9jc1xcZW11bGF0b3JzXFxjaGlwOFxcc3JjXFxqc1xcR2VuZXJpY1xcSW5zdHJ1Y3Rpb25IYW5kbGVyc1xcSnBBZGRyLmpzIiwiLi5cXC4uXFwuLlxcQXBhY2hlXFxodGRvY3NcXGVtdWxhdG9yc1xcY2hpcDhcXHNyY1xcanNcXEdlbmVyaWNcXEluc3RydWN0aW9uSGFuZGxlcnNcXEpwVm9BZGRyLmpzIiwiLi5cXC4uXFwuLlxcQXBhY2hlXFxodGRvY3NcXGVtdWxhdG9yc1xcY2hpcDhcXHNyY1xcanNcXEdlbmVyaWNcXEluc3RydWN0aW9uSGFuZGxlcnNcXExkQlZ4LmpzIiwiLi5cXC4uXFwuLlxcQXBhY2hlXFxodGRvY3NcXGVtdWxhdG9yc1xcY2hpcDhcXHNyY1xcanNcXEdlbmVyaWNcXEluc3RydWN0aW9uSGFuZGxlcnNcXExkRHRWeC5qcyIsIi4uXFwuLlxcLi5cXEFwYWNoZVxcaHRkb2NzXFxlbXVsYXRvcnNcXGNoaXA4XFxzcmNcXGpzXFxHZW5lcmljXFxJbnN0cnVjdGlvbkhhbmRsZXJzXFxMZEZWeC5qcyIsIi4uXFwuLlxcLi5cXEFwYWNoZVxcaHRkb2NzXFxlbXVsYXRvcnNcXGNoaXA4XFxzcmNcXGpzXFxHZW5lcmljXFxJbnN0cnVjdGlvbkhhbmRsZXJzXFxMZElBZGRyLmpzIiwiLi5cXC4uXFwuLlxcQXBhY2hlXFxodGRvY3NcXGVtdWxhdG9yc1xcY2hpcDhcXHNyY1xcanNcXEdlbmVyaWNcXEluc3RydWN0aW9uSGFuZGxlcnNcXExkSVZ4LmpzIiwiLi5cXC4uXFwuLlxcQXBhY2hlXFxodGRvY3NcXGVtdWxhdG9yc1xcY2hpcDhcXHNyY1xcanNcXEdlbmVyaWNcXEluc3RydWN0aW9uSGFuZGxlcnNcXExkU3RWeC5qcyIsIi4uXFwuLlxcLi5cXEFwYWNoZVxcaHRkb2NzXFxlbXVsYXRvcnNcXGNoaXA4XFxzcmNcXGpzXFxHZW5lcmljXFxJbnN0cnVjdGlvbkhhbmRsZXJzXFxMZFZ4Qnl0ZS5qcyIsIi4uXFwuLlxcLi5cXEFwYWNoZVxcaHRkb2NzXFxlbXVsYXRvcnNcXGNoaXA4XFxzcmNcXGpzXFxHZW5lcmljXFxJbnN0cnVjdGlvbkhhbmRsZXJzXFxMZFZ4RHQuanMiLCIuLlxcLi5cXC4uXFxBcGFjaGVcXGh0ZG9jc1xcZW11bGF0b3JzXFxjaGlwOFxcc3JjXFxqc1xcR2VuZXJpY1xcSW5zdHJ1Y3Rpb25IYW5kbGVyc1xcTGRWeEkuanMiLCIuLlxcLi5cXC4uXFxBcGFjaGVcXGh0ZG9jc1xcZW11bGF0b3JzXFxjaGlwOFxcc3JjXFxqc1xcR2VuZXJpY1xcSW5zdHJ1Y3Rpb25IYW5kbGVyc1xcTGRWeEsuanMiLCIuLlxcLi5cXC4uXFxBcGFjaGVcXGh0ZG9jc1xcZW11bGF0b3JzXFxjaGlwOFxcc3JjXFxqc1xcR2VuZXJpY1xcSW5zdHJ1Y3Rpb25IYW5kbGVyc1xcTGRWeFZ5LmpzIiwiLi5cXC4uXFwuLlxcQXBhY2hlXFxodGRvY3NcXGVtdWxhdG9yc1xcY2hpcDhcXHNyY1xcanNcXEdlbmVyaWNcXEluc3RydWN0aW9uSGFuZGxlcnNcXE9yVnhWeS5qcyIsIi4uXFwuLlxcLi5cXEFwYWNoZVxcaHRkb2NzXFxlbXVsYXRvcnNcXGNoaXA4XFxzcmNcXGpzXFxHZW5lcmljXFxJbnN0cnVjdGlvbkhhbmRsZXJzXFxSZXQuanMiLCIuLlxcLi5cXC4uXFxBcGFjaGVcXGh0ZG9jc1xcZW11bGF0b3JzXFxjaGlwOFxcc3JjXFxqc1xcR2VuZXJpY1xcSW5zdHJ1Y3Rpb25IYW5kbGVyc1xcUm5kVnhCeXRlLmpzIiwiLi5cXC4uXFwuLlxcQXBhY2hlXFxodGRvY3NcXGVtdWxhdG9yc1xcY2hpcDhcXHNyY1xcanNcXEdlbmVyaWNcXEluc3RydWN0aW9uSGFuZGxlcnNcXFNlVnhCeXRlLmpzIiwiLi5cXC4uXFwuLlxcQXBhY2hlXFxodGRvY3NcXGVtdWxhdG9yc1xcY2hpcDhcXHNyY1xcanNcXEdlbmVyaWNcXEluc3RydWN0aW9uSGFuZGxlcnNcXFNlVnhWeS5qcyIsIi4uXFwuLlxcLi5cXEFwYWNoZVxcaHRkb2NzXFxlbXVsYXRvcnNcXGNoaXA4XFxzcmNcXGpzXFxHZW5lcmljXFxJbnN0cnVjdGlvbkhhbmRsZXJzXFxTaGxWeFZ5LmpzIiwiLi5cXC4uXFwuLlxcQXBhY2hlXFxodGRvY3NcXGVtdWxhdG9yc1xcY2hpcDhcXHNyY1xcanNcXEdlbmVyaWNcXEluc3RydWN0aW9uSGFuZGxlcnNcXFNoclZ4VnkuanMiLCIuLlxcLi5cXC4uXFxBcGFjaGVcXGh0ZG9jc1xcZW11bGF0b3JzXFxjaGlwOFxcc3JjXFxqc1xcR2VuZXJpY1xcSW5zdHJ1Y3Rpb25IYW5kbGVyc1xcU2tucFZ4LmpzIiwiLi5cXC4uXFwuLlxcQXBhY2hlXFxodGRvY3NcXGVtdWxhdG9yc1xcY2hpcDhcXHNyY1xcanNcXEdlbmVyaWNcXEluc3RydWN0aW9uSGFuZGxlcnNcXFNrcFZ4LmpzIiwiLi5cXC4uXFwuLlxcQXBhY2hlXFxodGRvY3NcXGVtdWxhdG9yc1xcY2hpcDhcXHNyY1xcanNcXEdlbmVyaWNcXEluc3RydWN0aW9uSGFuZGxlcnNcXFNuZVZ4Qnl0ZS5qcyIsIi4uXFwuLlxcLi5cXEFwYWNoZVxcaHRkb2NzXFxlbXVsYXRvcnNcXGNoaXA4XFxzcmNcXGpzXFxHZW5lcmljXFxJbnN0cnVjdGlvbkhhbmRsZXJzXFxTbmVWeFZ5LmpzIiwiLi5cXC4uXFwuLlxcQXBhY2hlXFxodGRvY3NcXGVtdWxhdG9yc1xcY2hpcDhcXHNyY1xcanNcXEdlbmVyaWNcXEluc3RydWN0aW9uSGFuZGxlcnNcXFN1YlZ4VnkuanMiLCIuLlxcLi5cXC4uXFxBcGFjaGVcXGh0ZG9jc1xcZW11bGF0b3JzXFxjaGlwOFxcc3JjXFxqc1xcR2VuZXJpY1xcSW5zdHJ1Y3Rpb25IYW5kbGVyc1xcU3ViblZ4VnkuanMiLCIuLlxcLi5cXC4uXFxBcGFjaGVcXGh0ZG9jc1xcZW11bGF0b3JzXFxjaGlwOFxcc3JjXFxqc1xcR2VuZXJpY1xcSW5zdHJ1Y3Rpb25IYW5kbGVyc1xcWG9yVnhWeS5qcyIsIi4uXFwuLlxcLi5cXEFwYWNoZVxcaHRkb2NzXFxlbXVsYXRvcnNcXGNoaXA4XFxzcmNcXGpzXFxHZW5lcmljXFxJbnN0cnVjdGlvbkhhbmRsZXJzXFxsb2FkZXIuanMiLCIuLlxcLi5cXC4uXFxBcGFjaGVcXGh0ZG9jc1xcZW11bGF0b3JzXFxjaGlwOFxcc3JjXFxqc1xcR2VuZXJpY1xcS2V5Ym9hcmRcXEtleS5qcyIsIi4uXFwuLlxcLi5cXEFwYWNoZVxcaHRkb2NzXFxlbXVsYXRvcnNcXGNoaXA4XFxzcmNcXGpzXFxHZW5lcmljXFxLZXlib2FyZFxcTWFwLmpzIiwiLi5cXC4uXFwuLlxcQXBhY2hlXFxodGRvY3NcXGVtdWxhdG9yc1xcY2hpcDhcXHNyY1xcanNcXEdlbmVyaWNcXE9wQ29kZS5qcyIsIi4uXFwuLlxcLi5cXEFwYWNoZVxcaHRkb2NzXFxlbXVsYXRvcnNcXGNoaXA4XFxzcmNcXGpzXFxHZW5lcmljXFxQQy5qcyIsIi4uXFwuLlxcLi5cXEFwYWNoZVxcaHRkb2NzXFxlbXVsYXRvcnNcXGNoaXA4XFxzcmNcXGpzXFxTZXJ2aWNlc1xcQ1BVLmpzIiwiLi5cXC4uXFwuLlxcQXBhY2hlXFxodGRvY3NcXGVtdWxhdG9yc1xcY2hpcDhcXHNyY1xcanNcXFNlcnZpY2VzXFxLZXlib2FyZC5qcyIsIi4uXFwuLlxcLi5cXEFwYWNoZVxcaHRkb2NzXFxlbXVsYXRvcnNcXGNoaXA4XFxzcmNcXGpzXFxTZXJ2aWNlc1xcTWVtb3J5LmpzIiwiLi5cXC4uXFwuLlxcQXBhY2hlXFxodGRvY3NcXGVtdWxhdG9yc1xcY2hpcDhcXHNyY1xcanNcXFNlcnZpY2VzXFxSZWdpc3RlcnMuanMiLCIuLlxcLi5cXC4uXFxBcGFjaGVcXGh0ZG9jc1xcZW11bGF0b3JzXFxjaGlwOFxcc3JjXFxqc1xcU2VydmljZXNcXFJvYW1Mb2FkZXIuanMiLCIuLlxcLi5cXC4uXFxBcGFjaGVcXGh0ZG9jc1xcZW11bGF0b3JzXFxjaGlwOFxcc3JjXFxqc1xcU2VydmljZXNcXFNjcmVlbi5qcyIsIi4uXFwuLlxcLi5cXEFwYWNoZVxcaHRkb2NzXFxlbXVsYXRvcnNcXGNoaXA4XFxzcmNcXGpzXFxTZXJ2aWNlc1xcU2V0dGluZ3MuanMiLCIuLlxcLi5cXC4uXFxBcGFjaGVcXGh0ZG9jc1xcZW11bGF0b3JzXFxjaGlwOFxcc3JjXFxqc1xcU2VydmljZXNcXFNpZGVQYW5lbC5qcyIsIi4uXFwuLlxcLi5cXEFwYWNoZVxcaHRkb2NzXFxlbXVsYXRvcnNcXGNoaXA4XFxzcmNcXGpzXFxTZXJ2aWNlc1xcU3BlYWtlci5qcyIsIi4uXFwuLlxcLi5cXEFwYWNoZVxcaHRkb2NzXFxlbXVsYXRvcnNcXGNoaXA4XFxzcmNcXGpzXFxTZXJ2aWNlc1xcU3RhY2suanMiLCIuLlxcLi5cXC4uXFxBcGFjaGVcXGh0ZG9jc1xcZW11bGF0b3JzXFxjaGlwOFxcc3JjXFxqc1xcY29tcG9uZW50cy5qcyIsInNyY1xcanNcXG1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0FBOzs7Ozs7OztBQUVBLElBQUksVUFBVTtBQUNWLE9BQUcsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsQ0FETztBQUVWLE9BQUcsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsQ0FGTztBQUdWLE9BQUcsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsQ0FITztBQUlWLE9BQUcsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsQ0FKTztBQUtWLE9BQUcsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsQ0FMTztBQU1WLE9BQUcsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsQ0FOTztBQU9WLE9BQUcsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsQ0FQTztBQVFWLE9BQUcsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsQ0FSTztBQVNWLE9BQUcsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsQ0FUTztBQVVWLE9BQUcsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsQ0FWTztBQVdWLE9BQUcsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsQ0FYTztBQVlWLE9BQUcsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsQ0FaTztBQWFWLE9BQUcsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsQ0FiTztB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U0FBSixDQUFjLFFBQWQsRUFBd0IsWUFBVztBQUMvQixlQUFPLCtCQUFQO0FBQ0gsS0FGRDs7QUFJQSxRQUFJLFNBQUosQ0FBYyxXQUFkLEVBQTJCLFlBQVk7QUFDbkMsZUFBTyx5QkFBUDtBQUNILEtBRkQ7O0FBSUEsUUFBSSxTQUFKLENBQWMsVUFBZCxFQUEwQixDQUFDLG1CQUFELEVBQXNCLFlBQXRCLEVBQW9DLFVBQUMsaUJBQUQsRUFBb0IsR0FBcEIsRUFBNEI7QUFDdEYsZUFBTyxnQ0FBc0IsaUJBQXRCLEVBQXlDLEdBQXpDLENBQVA7QUFDSCxLQUZ5QixDQUExQjs7QUFJQSxRQUFJLFNBQUosQ0FBYyxRQUFkLEVBQXdCLFlBQVk7QUFDaEMsZUFBTywrQkFBUDtBQUNILEtBRkQ7QUFHSCxDOzs7OztBQ25ERDs7Ozs7O0FBRUEsSUFBSSxlQUFlLFFBQVEsTUFBUixDQUFlLGVBQWYsRUFBZ0MsRUFBaEMsQ0FBbkI7O0FBRUEsMEJBQW9CLFlBQXBCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBIZXggZnJvbSBcIi4vLi4vR2VuZXJpYy9IZXhcIjtcblxubGV0IHNwcml0ZXMgPSB7XG4gICAgMDogW1wiRjBcIiwgXCI5MFwiLCBcIjkwXCIsIFwiOTBcIiwgXCJGMFwiXSxcbiAgICAxOiBbXCIyMFwiLCBcIjYwXCIsIFwiMjBcIiwgXCIyMFwiLCBcIjcwXCJdLFxuICAgIDI6IFtcIkYwXCIsIFwiMTBcIiwgXCJGMFwiLCBcIjgwXCIsIFwiRjBcIl0sXG4gICAgMzogW1wiRjBcIiwgXCIxMFwiLCBcIkYwXCIsIFwiMTBcIiwgXCJGMFwiXSxcbiAgICA0OiBbXCI5MFwiLCBcIjkwXCIsIFwiRjBcIiwgXCIxMFwiLCBcIjEwXCJdLFxuICAgIDU6IFtcIkYwXCIsIFwiODBcIiwgXCJGMFwiLCBcIjEwXCIsIFwiRjBcIl0sXG4gICAgNjogW1wiRjBcIiwgXCI4MFwiLCBcIkYwXCIsIFwiOTBcIiwgXCJGMFwiXSxcbiAgICA3OiBbXCJGMFwiLCBcIjEwXCIsIFwiMjBcIiwgXCI0MFwiLCBcIjQwXCJdLFxuICAgIDg6IFtcIkYwXCIsIFwiOTBcIiwgXCJGMFwiLCBcIjkwXCIsIFwiRjBcIl0sXG4gICAgOTogW1wiRjBcIiwgXCI5MFwiLCBcIkYwXCIsIFwiMTBcIiwgXCJGMFwiXSxcbiAgICBhOiBbXCJGMFwiLCBcIjkwXCIsIFwiRjBcIiwgXCI5MFwiLCBcIjkwXCJdLFxuICAgIGI6IFtcIkUwXCIsIFwiOTBcIiwgXCJFMFwiLCBcIjkwXCIsIFwiRTBcIl0sXG4gICAgYzogW1wiRjBcIiwgXCI4MFwiLCBcIjgwXCIsIFwiODBcIiwgXCJGMFwiXSxcbiAgICBkOiBbXCJFMFwiLCBcIjkwXCIsIFwiOTBcIiwgXCI5MFwiLCBcIkUwXCJdLFxuICAgIGU6IFtcIkYwXCIsIFwiODBcIiwgXCJGMFwiLCBcIjgwXCIsIFwiRjBcIl0sXG4gICAgZjogW1wiRjBcIiwgXCI4MFwiLCBcIkYwXCIsIFwiODBcIiwgXCI4MFwiXSxcbn07XG5cbmxldCBzdGFydGluZ1RpdGxlID0gXCJEcm9wIG9yIGNsaWNrIGxvYWQgcm9hbSB0byBsb2FkIGdhbWVcIjtcblxuLyoqXG4gKiBAcHJvcGVydHkge0NQVX0gY3B1XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVSdW5uZXJDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3Rvcigkc2NvcGUsICRyb290U2NvcGUsICR0aW1lb3V0LCBDcHVTZXJ2aWNlLCBTZXR0aW5nc1NlcnZpY2UsIFNpZGVQYW5lbFNlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5jcHUgPSBDcHVTZXJ2aWNlO1xuICAgICAgICB0aGlzLnNldHRpbmdzID0gU2V0dGluZ3NTZXJ2aWNlO1xuICAgICAgICB0aGlzLmxhc3RGcmFtZVRpbWUgPSAwO1xuICAgICAgICB0aGlzLnNpZGVQYW5lbCA9IFNpZGVQYW5lbFNlcnZpY2U7XG5cbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlID0gJHJvb3RTY29wZTtcbiAgICAgICAgdGhpcy4kc2NvcGUgPSAkc2NvcGU7XG4gICAgICAgIHRoaXMuJHNjb3BlLnNldHRpbmdzID0gU2V0dGluZ3NTZXJ2aWNlO1xuICAgICAgICB0aGlzLiRzY29wZS50aXRsZSA9IHN0YXJ0aW5nVGl0bGU7XG4gICAgICAgIHRoaXMuJHNjb3BlLnNpZGVQYW5lbCA9IHRoaXMuc2lkZVBhbmVsO1xuICAgICAgICB0aGlzLiRzY29wZS5rZWVwUnVubmluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLiRzY29wZS5wYXVzZSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuJHNjb3BlLmNwdSA9IHRoaXMuY3B1O1xuICAgICAgICB0aGlzLiRzY29wZS5yZXNldCA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy4kc2NvcGUuc29mdFJlc2V0ID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zb2Z0UmVzZXQoKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy4kc2NvcGUuZGVidWcgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oXCJnYW1lQW5hbHl6ZWRcIiwgKGUsIHJvbSwgZ2FtZUZpbGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEdhbWUgPSBnYW1lRmlsZTtcbiAgICAgICAgICAgIHRoaXMuc3RvcmVIZXhhZGVjaW1hbFNwcml0ZXNJblJvbShyb20pO1xuICAgICAgICAgICAgdGhpcy5jcHUubWVtb3J5LnN0b3JlQ2h1bmsocm9tLCBuZXcgSGV4KFwiMFwiKSk7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0KHJvbSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lKCk7XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIHRoaXMuJHNjb3BlLnRpdGxlID0gXCJbUnVubmluZ10gXCIgKyB0aGlzLmN1cnJlbnRHYW1lLm5hbWU7XG4gICAgICAgIHRoaXMuY3B1LnBjLmp1bXBUbyhuZXcgSGV4KFwiMjAwXCIpKTtcblxuICAgICAgICB0aGlzLiRzY29wZS5rZWVwUnVubmluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuJHNjb3BlLnN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLiRzY29wZS5uZXh0U3RlcCA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY3B1Lm5leHRJbnN0cnVjdGlvbigpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLiRzY29wZS5ydW4gPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJ1bigpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnJ1bigpO1xuICAgIH1cblxuICAgIHJ1bigpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNSdW5uaW5nKCkpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1BhdXNlZCgpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHRpbWUgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zZXR0aW5ncy5yZXN0cmljdFNwZWVkIHx8IHRpbWUgLSB0aGlzLmxhc3RGcmFtZVRpbWUgPiAxMDAwIC8gdGhpcy5zZXR0aW5ncy5pbnN0cnVjdGlvbnNQZXJTZWNvbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0RnJhbWVUaW1lID0gdGltZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNwdS5uZXh0SW5zdHJ1Y3Rpb24oKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZXRJbW1lZGlhdGUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucnVuKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFuaW1hdGlvbkZyYW1lKCkge1xuICAgICAgICB0aGlzLiRzY29wZS4kZXZhbEFzeW5jKCgpID0+IHtcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzUnVubmluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3B1LmFuaW1hdGlvbkZyYW1lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwYXVzZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNSdW5uaW5nKCkpIHtcbiAgICAgICAgICAgIHRoaXMudGl0bGUgPSBcIltQYXVzZWRdIFwiICsgdGhpcy5jdXJyZW50R2FtZS5uYW1lO1xuICAgICAgICAgICAgdGhpcy4kc2NvcGUucGF1c2UgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RvcCgpIHtcbiAgICAgICAgdGhpcy4kc2NvcGUua2VlcFJ1bm5pbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZWFkU3ByaXRlKHN0YXJ0LCBzaXplKSB7XG4gICAgICAgIGxldCBpLCBzcHJpdGUgPSBbXSwgZW5kO1xuICAgICAgICBlbmQgPSBzdGFydCArIHBhcnNlSW50KHNpemUsIDE2KTtcbiAgICAgICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7IGkgKz0gMSkge1xuICAgICAgICAgICAgbGV0IGJpbmFyeSA9IE51bWJlcihwYXJzZUludCh0aGlzLmdhbWVEYXRhLnJvbVtpXSwgMTYpKS50b1N0cmluZygyKTtcbiAgICAgICAgICAgIHNwcml0ZS5wdXNoKFwiMDAwMDAwMDBcIi5zdWJzdHIoYmluYXJ5Lmxlbmd0aCkgKyBiaW5hcnkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzcHJpdGU7XG4gICAgfVxuXG4gICAgc3RvcmVIZXhhZGVjaW1hbFNwcml0ZXNJblJvbShyb20pIHtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBmb3IgKGxldCBzcHJpdGVOYW1lIG9mIE9iamVjdC5rZXlzKHNwcml0ZXMpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBieXRlIG9mIHNwcml0ZXNbc3ByaXRlTmFtZV0pIHtcbiAgICAgICAgICAgICAgICByb21baV0gPSBieXRlO1xuICAgICAgICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldFJlZ2lzdGVyKHJlZ2lzdGVyLCB2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIHZhbHVlID0gXCIwXCIgKyB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdhbWVEYXRhLnJlZ2lzdGVyc1tcInZcIiArIHJlZ2lzdGVyXSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldFJlZ2lzdGVyKHJlZ2lzdGVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdhbWVEYXRhLnJlZ2lzdGVyc1tcInZcIiArIHJlZ2lzdGVyXTtcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgdGhpcy4kc2NvcGUudGl0bGUgPSBzdGFydGluZ1RpdGxlO1xuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgdGhpcy5jcHUucmVzZXQoKTtcbiAgICAgICAgdGhpcy5jdXJyZW50R2FtZSA9IG51bGw7XG4gICAgfVxuXG4gICAgc29mdFJlc2V0KCkge1xuICAgICAgICBpZiAodGhpcy5pc1J1bm5pbmcoKSkge1xuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLmNwdS5zb2Z0UmVzZXQoKTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVycm9yKCkge1xuICAgICAgICB0aGlzLiRzY29wZS50aXRsZSA9IFwiRXJyb3Igb2NjdXJyZWQsIGVtdWxhdGlvbiBzdG9wcGVkXCI7XG4gICAgICAgIHRoaXMuJHNjb3BlLmtlZXBSdW5uaW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaXNSdW5uaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4kc2NvcGUua2VlcFJ1bm5pbmc7XG4gICAgfVxuXG4gICAgaXNQYXVzZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRzY29wZS5wYXVzZTtcbiAgICB9XG5cbiAgICBkZWJ1ZygpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudEdhbWUpIHtcbiAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcbiAgICAgICAgICAgIHRoaXMuJHNjb3BlLnRpdGxlID0gXCJbRGVidWdnaW5nXSBcIiArIHRoaXMuY3VycmVudEdhbWUubmFtZTtcbiAgICAgICAgICAgIHRoaXMuc2lkZVBhbmVsLmRlYnVnKCk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvYWRSb2FtRGlyZWN0aXZlIHtcblxuICAgIGNvbnN0cnVjdG9yKFJvYW1Mb2FkZXJTZXJ2aWNlLCBDUFUpIHtcbiAgICAgICAgdGhpcy5jcHUgPSBDUFU7XG4gICAgICAgIHRoaXMucmVzdHJpY3QgPSBcIkFcIjtcbiAgICAgICAgdGhpcy5yb2FtTG9hZGVyID0gUm9hbUxvYWRlclNlcnZpY2U7XG4gICAgfVxuXG4gICAgbGluaygkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIGxldCBidXR0b24gPSBlbGVtZW50WzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYnV0dG9uXCIpLml0ZW0oMCksXG4gICAgICAgICAgICBpbnB1dCA9IGVsZW1lbnRbMF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbnB1dFwiKS5pdGVtKDApO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyQnV0dG9uRXZlbnRzKGJ1dHRvbiwgaW5wdXQpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyQnV0dG9uRXZlbnRzKGJ1dHRvbiwgaW5wdXQpIHtcbiAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgaW5wdXQuY2xpY2soKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmlsZVNlbGVjdGVkKGUsIGUudGFyZ2V0LmZpbGVzWzBdKTtcbiAgICAgICAgICAgIGUudGFyZ2V0LnZhbHVlID0gXCJcIjtcbiAgICAgICAgfSk7XG4gICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5maWxlU2VsZWN0ZWQoZSwgZS5kYXRhVHJhbnNmZXIuZmlsZXNbMF0pO1xuICAgICAgICB9KTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZpbGVTZWxlY3RlZChlLCBlLmRhdGFUcmFuc2Zlci5maWxlc1swXSk7XG4gICAgICAgIH0pO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZpbGVEcmFnZ2VkKGUsIGUuZGF0YVRyYW5zZmVyLmZpbGVzWzBdKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2l0aG91dCBjYXRjaGluZyBkcmFnT3ZlciBldmVudCBkcm9wIGV2ZW50IHdvbid0IGJlIGNhdGNoZWQuXG4gICAgICogQHBhcmFtIGVcbiAgICAgKiBAcGFyYW0gZmlsZVxuICAgICAqL1xuICAgIGZpbGVEcmFnZ2VkKGUsIGZpbGUpIHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIGZpbGVTZWxlY3RlZChlLCBmaWxlKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBpZiAoZmlsZSkge1xuICAgICAgICAgICAgdGhpcy5zdG9wQ3VycmVudEdhbWUoKTtcbiAgICAgICAgICAgIHRoaXMucm9hbUxvYWRlci5sb2FkKGZpbGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RvcEN1cnJlbnRHYW1lKCkge1xuICAgICAgICB0aGlzLmNwdS5yZXNldCgpO1xuICAgIH1cbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgS2V5cGFkRGlyZWN0aXZlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5yZXN0cmljdCA9IFwiQVwiO1xuICAgICAgICB0aGlzLnRlbXBsYXRlVXJsID0gXCJkaXJlY3RpdmUva2V5cGFkLmh0bWxcIjtcbiAgICAgICAgdGhpcy5yZXBsYWNlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zY29wZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnRyb2xsZXIoJHNjb3BlLCAkcm9vdFNjb3BlKSB7XG4gICAgfVxuXG4gICAgbGluaygkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgfVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQHByb3BlcnR5IHtBcnJheTxBcnJheTxpbnQ+Pn0gcGl4ZWxzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcmVlbkRpcmVjdGl2ZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMucmVzdHJpY3QgPSBcIkVcIjtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZVVybCA9IFwiZGlyZWN0aXZlL3NjcmVlbi5odG1sXCI7XG4gICAgICAgIHRoaXMucmVwbGFjZSA9IHRydWU7XG4gICAgfVxuXG4gICAgY29udHJvbGxlcigkc2NvcGUsICRyb290U2NvcGUpIHtcbiAgICB9XG5cbiAgICBsaW5rKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgJHNjb3BlLiRyb290LiRvbihcInNjcmVlblVwZGF0ZWRcIiwgKGUsIHBpeGVscykgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTY3JlZW4ocGl4ZWxzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2FudmFzID0gZWxlbWVudFswXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImNhbnZhc1wiKVswXTtcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIHRoaXMucGl4ZWxTaXplID0ge1xuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNhbnZhcy5jbGllbnRIZWlnaHQgLyAzMixcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNhbnZhcy5jbGllbnRXaWR0aCAvIDY0XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzLmNsaWVudEhlaWdodDtcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLmNhbnZhcy5jbGllbnRXaWR0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXkuPGludD59IG5ld1BpeGVsc1xuICAgICAqL1xuICAgIHVwZGF0ZVNjcmVlbihuZXdQaXhlbHMpIHtcbiAgICAgICAgaWYgKCF0aGlzLnBpeGVscykge1xuICAgICAgICAgICAgdGhpcy5waXhlbHMgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBuZXdQaXhlbHMpIHtcbiAgICAgICAgICAgICAgICBpZiAobmV3UGl4ZWxzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5waXhlbHNba2V5XSA9IG5ld1BpeGVsc1trZXldLnNsaWNlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wYWludEFsbCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RpdmVQYWludChuZXdQaXhlbHMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcGFpbnRBbGwoKSB7XG4gICAgICAgIGxldCBwaXhlbHNJdGVyYXRvciA9IHRoaXMuaXRlcmF0ZVBpeGVscygpLFxuICAgICAgICAgICAgcGl4ZWxEYXRhO1xuXG4gICAgICAgIHdoaWxlIChwaXhlbERhdGEgPSBwaXhlbHNJdGVyYXRvci5uZXh0KCkudmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMucGFpbnRQaXhlbChwaXhlbERhdGFbMF0sIHBpeGVsRGF0YVsxXSwgcGl4ZWxEYXRhWzJdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbGVjdGl2ZVBhaW50KG5ld1BpeGVscykge1xuICAgICAgICBsZXQgbmV3UGl4ZWxWYWx1ZSxcbiAgICAgICAgICAgIHBpeGVsRGF0YSxcbiAgICAgICAgICAgIHBpeGVsc0l0ZXJhdG9yID0gdGhpcy5pdGVyYXRlUGl4ZWxzKCk7XG5cbiAgICAgICAgd2hpbGUgKHBpeGVsRGF0YSA9IHBpeGVsc0l0ZXJhdG9yLm5leHQoKS52YWx1ZSkge1xuICAgICAgICAgICAgbmV3UGl4ZWxWYWx1ZSA9IG5ld1BpeGVsc1twaXhlbERhdGFbMF1dW3BpeGVsRGF0YVsxXV07XG4gICAgICAgICAgICBpZiAocGl4ZWxEYXRhWzJdICE9IG5ld1BpeGVsVmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhaW50UGl4ZWwocGl4ZWxEYXRhWzBdLCBwaXhlbERhdGFbMV0sIG5ld1BpeGVsVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcGFpbnRQaXhlbCh5LCB4LCBwaXhlbFZhbHVlKSB7XG4gICAgICAgIHRoaXMucGl4ZWxzW3ldW3hdID0gcGl4ZWxWYWx1ZTtcbiAgICAgICAgaWYgKHBpeGVsVmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCh4ICogdGhpcy5waXhlbFNpemUud2lkdGgsIHkgKiB0aGlzLnBpeGVsU2l6ZS5oZWlnaHQsIHRoaXMucGl4ZWxTaXplLndpZHRoLCB0aGlzLnBpeGVsU2l6ZS5oZWlnaHQpO1xuICAgIH1cblxuICAgICppdGVyYXRlUGl4ZWxzKCkge1xuICAgICAgICBmb3IgKGxldCB5IGluIHRoaXMucGl4ZWxzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5waXhlbHMuaGFzT3duUHJvcGVydHkoeSkpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB4IGluIHRoaXMucGl4ZWxzW3ldKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBpeGVsc1t5XS5oYXNPd25Qcm9wZXJ0eSh4KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgeWllbGQgW3ksIHgsIHRoaXMucGl4ZWxzW3ldW3hdXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuU2NyZWVuRGlyZWN0aXZlLiRpbmplY3QgPSBbXCIkcm9vdFNjb3BlXCJdOyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaWRlUGFuZWwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnJlc3RyaWN0ID0gXCJBXCI7XG4gICAgICAgIHRoaXMudGVtcGxhdGVVcmwgPSBcImRpcmVjdGl2ZS9zaWRlLXBhbmVsLmh0bWxcIjtcbiAgICAgICAgdGhpcy5yZXBsYWNlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zY29wZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnRyb2xsZXIoJHNjb3BlLCAkcm9vdFNjb3BlKSB7XG4gICAgfVxuXG4gICAgbGluaygkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgfVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhleCB7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSkge1xuICAgICAgICB0aGlzLnNldFRvKHZhbHVlKTtcbiAgICB9XG5cbiAgICBjb21wYXJlKGhleCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZSA9PSBoZXgudmFsdWU7XG4gICAgfVxuXG4gICAgdG9EZWMoKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLnZhbHVlLCAxNik7XG4gICAgfVxuXG4gICAgaW5jcmVtZW50KGlzUmVnaXN0ZXIgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLmFkZChuZXcgSGV4KFwiMVwiKSwgaXNSZWdpc3Rlcik7XG4gICAgfVxuXG4gICAgZGVjcmVtZW50KGlzUmVnaXN0ZXIgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLnN1YnRyYWN0KG5ldyBIZXgoXCIxXCIpLCBpc1JlZ2lzdGVyKTtcbiAgICB9XG5cbiAgICByb3VuZChuaWJibGVzQ291bnQpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWUuc2xpY2UoLW5pYmJsZXNDb3VudCk7XG4gICAgfVxuXG4gICAgdG9SZWdpc3RlcigpIHtcbiAgICAgICAgbGV0IG51bWJlciA9IHRoaXMudG9EZWMoKTtcbiAgICAgICAgaWYgKG51bWJlciA+IDI1NSkge1xuICAgICAgICAgICAgbnVtYmVyIC09IDI1NjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnZhbHVlID0gbnVtYmVyLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgLy8gdGhpcy52YWx1ZSA9ICh0aGlzLnRvRGVjKCkgJiAweGZmKS50b1N0cmluZygxNik7XG4gICAgfVxuXG4gICAgdG9SZWdpc3RlckkoKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSAodGhpcy50b0RlYygpICYgMHhmZmZmKS50b1N0cmluZygxNik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtIZXh9IGhleFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNSZWdpc3RlciByZWdpc3RlcnMgbXVzdCBoYXZlIHZhbHVlIGJldHdlZW4gMCBhbmQgMjU1IHdoaWxlIHNvbWUgb3RoZXIgZGF0YSBtYXkgc28gd2UgbmVlZCB0byBpbmRpY2F0ZSBpZiBjdXJyZW50IGhhc2hcbiAgICAgKiAgICAgICAgICAgICAgICAgICBzaW11bGF0ZXMgcmVnaXN0ZXJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBpc1JlZ2lzdGVyID0gdHJ1ZSBhbmQgcmVzdWx0ID4gMjU2IChmZikgYXMgc29tZSBjaGlwOCBpbnN0cnVjdGlvbnMgcmVxdWlyZSBhY3Rpb24gdG8gYmUgdGFrZW4gaW4gdGhhdCBjYXNlXG4gICAgICovXG4gICAgYWRkKGhleCwgaXNSZWdpc3RlciA9IGZhbHNlKSB7XG4gICAgICAgIGxldCBkZWNpbWFsVmFsdWUgPSBwYXJzZUludCh0aGlzLnZhbHVlLCAxNik7XG4gICAgICAgIGxldCBkZWNpbWFsQWRkZWRWYWx1ZSA9IHBhcnNlSW50KGhleC52YWx1ZSwgMTYpO1xuICAgICAgICBsZXQgcmVzdWx0ID0gZGVjaW1hbFZhbHVlICsgZGVjaW1hbEFkZGVkVmFsdWU7XG4gICAgICAgIGxldCBjYXJyeSA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChpc1JlZ2lzdGVyKSB7XG4gICAgICAgICAgICBjYXJyeSA9IChyZXN1bHQgJiAweEZGRkZGRjAwKSAhPT0gMDtcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPiAyNTUpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgLT0gMjU2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcmVzdWx0ICY9IDB4ZmY7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52YWx1ZSA9IHJlc3VsdC50b1N0cmluZygxNik7XG5cbiAgICAgICAgcmV0dXJuIGNhcnJ5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7SGV4fSBoZXhcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzUmVnaXN0ZXIgcmVnaXN0ZXJzIG11c3QgaGF2ZSB2YWx1ZSBiZXR3ZWVuIDAgYW5kIDI1NSB3aGlsZSBzb21lIG90aGVyIGRhdGEgbWF5IHNvIHdlIG5lZWQgdG8gaW5kaWNhdGUgaWYgY3VycmVudCBoYXNoXG4gICAgICogICAgICAgICAgICAgICAgICAgc2ltdWxhdGVzIHJlZ2lzdGVyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaXNSZWdpc3RlciA9IHRydWUgYW5kIHJlc3VsdCA8IDAgYXMgc29tZSBjaGlwOCBpbnN0cnVjdGlvbnMgcmVxdWlyZSBhY3Rpb24gdG8gYmUgdGFrZW4gaW4gdGhhdCBjYXNlXG4gICAgICovXG4gICAgc3VidHJhY3QoaGV4LCBpc1JlZ2lzdGVyID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IGRlY2ltYWxWYWx1ZSA9IHBhcnNlSW50KHRoaXMudmFsdWUsIDE2KTtcbiAgICAgICAgbGV0IGRlY2ltYWxBZGRlZFZhbHVlID0gcGFyc2VJbnQoaGV4LnZhbHVlLCAxNik7XG4gICAgICAgIGxldCByZXN1bHQgPSBkZWNpbWFsVmFsdWUgLSBkZWNpbWFsQWRkZWRWYWx1ZTtcbiAgICAgICAgbGV0IGNhcnJ5ID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKGlzUmVnaXN0ZXIpIHtcbiAgICAgICAgICAgIGNhcnJ5ID0gZGVjaW1hbFZhbHVlID49IGRlY2ltYWxBZGRlZFZhbHVlO1xuICAgICAgICAgICAgaWYgKHJlc3VsdCA8IDApIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gMjU2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcmVzdWx0ICY9IDB4ZmY7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnZhbHVlID0gcmVzdWx0LnRvU3RyaW5nKDE2KTtcblxuICAgICAgICByZXR1cm4gY2Fycnk7XG4gICAgfVxuXG4gICAgZGl2aWRlQnlUd28oKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBwYXJzZUludCh0aGlzLnZhbHVlLCAxNikgPj4gMTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IChyZXN1bHQpLnRvU3RyaW5nKDE2KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiByZXN1bHQgaXMgPiAyNTUgdGhlbiAyNTYgd2lsbCBiZSBzdWJ0cmFjdGVkIHRvIHNpbXVsYXRlIHJlZ2lzdGVyIGhleCAoMHgwMC0weGZmKSBhcyBvbmx5XG4gICAgICogcmVnaXN0ZXJzIGFyZSBtdWx0aXBsaWVkIGJ5IDIuXG4gICAgICovXG4gICAgbXVsdGlwbHlCeVR3byhpc1JlZ2lzdGVyID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHBhcnNlSW50KHRoaXMudmFsdWUsIDE2KSA8PCAxO1xuICAgICAgICBpZiAoaXNSZWdpc3Rlcikge1xuICAgICAgICAgICAgaWYgKHJlc3VsdCA+IDI1NSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCAtPSAyNTY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyByZXN1bHQgJj0gMHhmZjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnZhbHVlID0gKHJlc3VsdCkudG9TdHJpbmcoMTYpO1xuICAgIH1cblxuICAgIG9yKGhleCkge1xuICAgICAgICBsZXQgZGVjaW1hbFZhbHVlID0gcGFyc2VJbnQodGhpcy52YWx1ZSwgMTYpO1xuICAgICAgICBsZXQgZGVjaW1hbEhleFZhbHVlID0gcGFyc2VJbnQoaGV4LnZhbHVlLCAxNik7XG4gICAgICAgIHRoaXMudmFsdWUgPSAoZGVjaW1hbFZhbHVlIHwgZGVjaW1hbEhleFZhbHVlKS50b1N0cmluZygxNik7XG4gICAgfVxuXG4gICAgYW5kKGhleCkge1xuICAgICAgICBsZXQgZGVjaW1hbFZhbHVlID0gcGFyc2VJbnQodGhpcy52YWx1ZSwgMTYpO1xuICAgICAgICBsZXQgZGVjaW1hbEhleFZhbHVlID0gcGFyc2VJbnQoaGV4LnZhbHVlLCAxNik7XG4gICAgICAgIHRoaXMudmFsdWUgPSAoZGVjaW1hbFZhbHVlICYgZGVjaW1hbEhleFZhbHVlKS50b1N0cmluZygxNik7XG4gICAgfVxuXG4gICAgeG9yKGhleCkge1xuICAgICAgICBsZXQgZGVjaW1hbFZhbHVlID0gcGFyc2VJbnQodGhpcy52YWx1ZSwgMTYpO1xuICAgICAgICBsZXQgZGVjaW1hbEhleFZhbHVlID0gcGFyc2VJbnQoaGV4LnZhbHVlLCAxNik7XG4gICAgICAgIHRoaXMudmFsdWUgPSAoZGVjaW1hbFZhbHVlIF4gZGVjaW1hbEhleFZhbHVlKS50b1N0cmluZygxNik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWFrZXMgaXQgZWFzeSB0byBhdm9pZCBwcm9ibGVtcyB3aGVuIGFjY2Vzc2luZyBzdGFjayBvciByZWdpc3RlcnMgbWVtb3J5IHdoaWNoIGNhbiBob2xkXG4gICAgICogdXAgdG8gMTYgKDB4ZikgdmFsdWVzIHNvIHRoZXJlIGlzIG5vIHVuZXhwZWN0ZWQgYWNjZXNzIHRvIG5vbiBleGlzdGluZyBjZWxscyBsaWtlIDB4MDEuXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBsb3dlc3ROaWJibGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlLnNsaWNlKC0xKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTb21lIGhleGVzIHdpbGwgaGF2ZSAwMCB2YWx1ZSB3aGlsZSBvdGhlcnMgMCB3aGljaCB3aWxsIHJlc3VsdCBpbiBub3QgbWF0Y2hpbmcgdmFsdWVzXG4gICAgICogc28gdGhpcyBmdW5jdGlvbiBtYWtlcyBzdXJlIHZhbHVlcyAweDBmIGFuZCAweGYgYXJlIHNlZW4gYXMgZXF1YWwuXG4gICAgICogQHBhcmFtIGhleFxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGlzRXF1YWxUbyhoZXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVhbFZhbHVlKCkgPT0gaGV4LnJlYWxWYWx1ZSgpO1xuICAgIH1cblxuICAgIHJlYWxWYWx1ZSgpIHtcbiAgICAgICAgbGV0IGNoYXJzVG9EaXNjYXJkID0gMDtcbiAgICAgICAgZm9yIChsZXQgY2hhciBvZiB0aGlzLnZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoY2hhciA9PSBcIjBcIikge1xuICAgICAgICAgICAgICAgIGNoYXJzVG9EaXNjYXJkICs9IDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNoYXJzVG9EaXNjYXJkID09IHRoaXMudmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gXCIwXCI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS5zdWJzdHJpbmcoY2hhcnNUb0Rpc2NhcmQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEF2b2lkcyBoYXJkIHRvIGRlYnVnIHByb2JsZW1zIHdoZW4gaGV4IGlzIHBhc3NlZCBhcyByZWZlcmVuY2Ugd2hpY2ggaXMgZGVmYXVsdCBKYXZhU2NyaXB0IGJlaGF2aW91ci5cbiAgICAgKiBAcmV0dXJucyB7SGV4fVxuICAgICAqL1xuICAgIGNvcHkoKSB7XG4gICAgICAgIHJldHVybiBuZXcgSGV4KHRoaXMudmFsdWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICAgICAqL1xuICAgIHNldFRvKHZhbHVlKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSBTdHJpbmcodmFsdWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgY2xhc3MgaXMgY29udmVuaWVudCBwbGFjZSB0byBwdXQgcmFuZG9tIGhleCBpbiB3aGljaCBpcyByZXF1aXJlZCBieSBvbmUgb2YgY2hpcDggaW5zdHJ1Y3Rpb25zLlxuICAgICAqIEBwYXJhbSB7SGV4fSBoZXhNYXhcbiAgICAgKiBAcmV0dXJucyB7SGV4fVxuICAgICAqL1xuICAgIHN0YXRpYyByYW5kb20oaGV4TWF4KSB7XG4gICAgICAgIHJldHVybiBuZXcgSGV4KChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaGV4TWF4LnRvRGVjKCkgKyAxKSkpLnRvU3RyaW5nKDE2KSk7XG4gICAgfVxufSIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgSW5zdHJ1Y3Rpb25IYW5kbGVyIGZyb20gXCIuL0luc3RydWN0aW9uSGFuZGxlclwiO1xuaW1wb3J0IEhleCBmcm9tIFwiLi8uLi9IZXhcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWRkSVZ4IGV4dGVuZHMgSW5zdHJ1Y3Rpb25IYW5kbGVyIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T3BDb2RlfSBvcENvZGVcbiAgICAgKi9cbiAgICBleGVjdXRlKG9wQ29kZSkge1xuICAgICAgICB0aGlzLmNwdS5yZWdpc3RlckkuYWRkKHRoaXMuY3B1LnJlZ2lzdGVycy5yZWFkKG9wQ29kZS5oZXgoMSwgMSkpLmNvcHkoKSk7XG4gICAgfVxufVxuXG5BZGRJVnguaW5zdHJ1Y3Rpb25SZWdleCA9IFwiZi4xZVwiOyIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgSW5zdHJ1Y3Rpb25IYW5kbGVyIGZyb20gXCIuL0luc3RydWN0aW9uSGFuZGxlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBZGRWeEJ5dGUgZXh0ZW5kcyBJbnN0cnVjdGlvbkhhbmRsZXIge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtPcENvZGV9IG9wQ29kZVxuICAgICAqL1xuICAgIGV4ZWN1dGUob3BDb2RlKSB7XG4gICAgICAgIHRoaXMuY3B1LnJlZ2lzdGVycy5yZWFkKG9wQ29kZS5oZXgoMSwgMSkpLmFkZChvcENvZGUuaGV4KDIsIDIpLCB0cnVlKTtcbiAgICB9XG59XG5cbkFkZFZ4Qnl0ZS5pbnN0cnVjdGlvblJlZ2V4ID0gXCI3Li4uXCI7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBJbnN0cnVjdGlvbkhhbmRsZXIgZnJvbSBcIi4vSW5zdHJ1Y3Rpb25IYW5kbGVyXCI7XG5pbXBvcnQgSGV4IGZyb20gXCIuLy4uL0hleFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBZGRWeFZ5IGV4dGVuZHMgSW5zdHJ1Y3Rpb25IYW5kbGVyIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T3BDb2RlfSBvcENvZGVcbiAgICAgKi9cbiAgICBleGVjdXRlKG9wQ29kZSkge1xuICAgICAgICBsZXQgdnhWYWx1ZSA9IHRoaXMuY3B1LnJlZ2lzdGVycy5yZWFkKG9wQ29kZS5oZXgoMSkpO1xuICAgICAgICBsZXQgdnlWYWx1ZSA9IHRoaXMuY3B1LnJlZ2lzdGVycy5yZWFkKG9wQ29kZS5oZXgoMikpO1xuICAgICAgICBsZXQgY2FycnkgPSB2eFZhbHVlLmFkZCh2eVZhbHVlLCB0cnVlKTtcblxuICAgICAgICBjYXJyeSA9IGNhcnJ5ID09IHRydWUgPyBuZXcgSGV4KFwiMVwiKSA6IG5ldyBIZXgoXCIwXCIpO1xuICAgICAgICB0aGlzLmNwdS5yZWdpc3RlcnMuc3RvcmUobmV3IEhleChcImZcIiksIGNhcnJ5KTtcbiAgICB9XG59XG5cbkFkZFZ4VnkuaW5zdHJ1Y3Rpb25SZWdleCA9IFwiOC4uNFwiOyIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgSW5zdHJ1Y3Rpb25IYW5kbGVyIGZyb20gXCIuL0luc3RydWN0aW9uSGFuZGxlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmRWeFZ5IGV4dGVuZHMgSW5zdHJ1Y3Rpb25IYW5kbGVyIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T3BDb2RlfSBvcENvZGVcbiAgICAgKi9cbiAgICBleGVjdXRlKG9wQ29kZSkge1xuICAgICAgICBsZXQgdnhWYWx1ZSA9IHRoaXMuY3B1LnJlZ2lzdGVycy5yZWFkKG9wQ29kZS5oZXgoMSkpO1xuICAgICAgICBsZXQgdnlWYWx1ZSA9IHRoaXMuY3B1LnJlZ2lzdGVycy5yZWFkKG9wQ29kZS5oZXgoMikpO1xuICAgICAgICB2eFZhbHVlLmFuZCh2eVZhbHVlKTtcbiAgICB9XG59XG5cbkFuZFZ4VnkuaW5zdHJ1Y3Rpb25SZWdleCA9IFwiOC4uMlwiOyIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgSW5zdHJ1Y3Rpb25IYW5kbGVyIGZyb20gXCIuL0luc3RydWN0aW9uSGFuZGxlclwiO1xuaW1wb3J0IEhleCBmcm9tIFwiLi8uLi9IZXhcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FsbEFkZHIgZXh0ZW5kcyBJbnN0cnVjdGlvbkhhbmRsZXIge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtPcENvZGV9IG9wQ29kZVxuICAgICAqL1xuICAgIGV4ZWN1dGUob3BDb2RlKSB7XG4gICAgICAgIGxldCBoZXhUb1N0b3JlID0gbmV3IEhleCh0aGlzLmNwdS5wYy52YWx1ZSk7XG4gICAgICAgIGhleFRvU3RvcmUuYWRkKG5ldyBIZXgoXCIwMlwiKSk7XG4gICAgICAgIHRoaXMuY3B1LnN0YWNrLnB1dChoZXhUb1N0b3JlKTtcbiAgICAgICAgdGhpcy5jcHUucGMuanVtcFRvKG9wQ29kZS5oZXgoMSwgMykpO1xuICAgIH1cbn1cblxuQ2FsbEFkZHIuaW5zdHJ1Y3Rpb25SZWdleCA9IFwiMi4uLlwiOyIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgSW5zdHJ1Y3Rpb25IYW5kbGVyIGZyb20gXCIuL0luc3RydWN0aW9uSGFuZGxlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbHMgZXh0ZW5kcyBJbnN0cnVjdGlvbkhhbmRsZXIge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtPcENvZGV9IG9wQ29kZVxuICAgICAqL1xuICAgIGV4ZWN1dGUob3BDb2RlKSB7XG4gICAgICAgIHRoaXMuY3B1LnNjcmVlbi5jbGVhcigpO1xuICAgIH1cbn1cblxuQ2xzLmluc3RydWN0aW9uUmVnZXggPSBcIjAwZTBcIjsiLCJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IEluc3RydWN0aW9uSGFuZGxlciBmcm9tIFwiLi9JbnN0cnVjdGlvbkhhbmRsZXJcIjtcbmltcG9ydCBIZXggZnJvbSBcIi4vLi4vSGV4XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERyd1Z4VnlOaWJibGUgZXh0ZW5kcyBJbnN0cnVjdGlvbkhhbmRsZXIge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtPcENvZGV9IG9wQ29kZVxuICAgICAqL1xuICAgIGV4ZWN1dGUob3BDb2RlKSB7XG4gICAgICAgIGxldCBzcHJpdGUgPSB0aGlzLmNwdS5tZW1vcnkucmVhZENodW5rKG9wQ29kZS5oZXgoMykudG9EZWMoKSwgdGhpcy5jcHUucmVnaXN0ZXJJKTtcbiAgICAgICAgbGV0IHggPSB0aGlzLmNwdS5yZWdpc3RlcnMucmVhZChvcENvZGUuaGV4KDEpKS50b0RlYygpO1xuICAgICAgICBsZXQgeSA9IHRoaXMuY3B1LnJlZ2lzdGVycy5yZWFkKG9wQ29kZS5oZXgoMikpLnRvRGVjKCk7XG4gICAgICAgIGxldCBjb2xsaXNpb24gPSB0aGlzLmNwdS5zY3JlZW4uZGlzcGxheVNwcml0ZSh4LCB5LCBzcHJpdGUpO1xuICAgICAgICB0aGlzLmNwdS5yZWdpc3RlcnMuc3RvcmUobmV3IEhleChcImZcIiksIG5ldyBIZXgoKGNvbGxpc2lvbiA/IFwiMVwiIDogXCIwXCIpKSk7XG4gICAgfVxufVxuXG5EcndWeFZ5TmliYmxlLmluc3RydWN0aW9uUmVnZXggPSBcImQuLi5cIjsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5zdHJ1Y3Rpb25IYW5kbGVyIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7Q1BVfSBDcHVTZXJ2aWNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoQ3B1U2VydmljZSkge1xuICAgICAgICB0aGlzLmNwdSA9IENwdVNlcnZpY2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtPcENvZGV9IG9wQ29kZVxuICAgICAqL1xuICAgIGV4ZWN1dGUob3BDb2RlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCB5ZXQgaW1wbGVtZW50ZWQuXCIpO1xuICAgIH1cbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IEluc3RydWN0aW9uSGFuZGxlciBmcm9tIFwiLi9JbnN0cnVjdGlvbkhhbmRsZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSnBBZGRyIGV4dGVuZHMgSW5zdHJ1Y3Rpb25IYW5kbGVyIHtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T3BDb2RlfSBvcENvZGVcbiAgICAgKi9cbiAgICBleGVjdXRlKG9wQ29kZSkge1xuICAgICAgICB0aGlzLmNwdS5wYy5qdW1wVG8ob3BDb2RlLmhleCgxLCAzKSk7XG4gICAgfVxufVxuXG5KcEFkZHIuaW5zdHJ1Y3Rpb25SZWdleCA9IFwiMS4uLlwiOyIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgSW5zdHJ1Y3Rpb25IYW5kbGVyIGZyb20gXCIuL0luc3RydWN0aW9uSGFuZGxlclwiO1xuaW1wb3J0IEhleCBmcm9tIFwiLi8uLi9IZXhcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSnBWb0FkZHIgZXh0ZW5kcyBJbnN0cnVjdGlvbkhhbmRsZXIge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtPcENvZGV9IG9wQ29kZVxuICAgICAqL1xuICAgIGV4ZWN1dGUob3BDb2RlKSB7XG4gICAgICAgIGxldCB2MFZhbHVlID0gdGhpcy5jcHUucmVnaXN0ZXJzLnJlYWQobmV3IEhleChcIjBcIikpO1xuICAgICAgICB0aGlzLmNwdS5wYy5qdW1wVG8ob3BDb2RlLmhleCgxLCAzKS5hZGQodjBWYWx1ZSkpO1xuICAgIH1cbn1cblxuSnBWb0FkZHIuaW5zdHJ1Y3Rpb25SZWdleCA9IFwiYi4uLlwiOyIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgSW5zdHJ1Y3Rpb25IYW5kbGVyIGZyb20gXCIuL0luc3RydWN0aW9uSGFuZGxlclwiO1xuaW1wb3J0IEhleCBmcm9tIFwiLi8uLi9IZXhcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGRCVnggZXh0ZW5kcyBJbnN0cnVjdGlvbkhhbmRsZXIge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtPcENvZGV9IG9wQ29kZVxuICAgICAqL1xuICAgIGV4ZWN1dGUob3BDb2RlKSB7XG4gICAgICAgIGxldCBudW1iZXJUb1N0b3JlID0gdGhpcy5jcHUucmVnaXN0ZXJzLnJlYWQob3BDb2RlLmhleCgxKSkudG9EZWMoKTtcbiAgICAgICAgbGV0IG1lbW9yeUxvY2F0aW9uID0gdGhpcy5jcHUucmVnaXN0ZXJJLmNvcHkoKTtcblxuICAgICAgICB0aGlzLmNwdS5tZW1vcnkuc3RvcmVCeXRlKG5ldyBIZXgoTWF0aC5mbG9vcihudW1iZXJUb1N0b3JlIC8gMTAwKSksIG1lbW9yeUxvY2F0aW9uKTtcbiAgICAgICAgbWVtb3J5TG9jYXRpb24uaW5jcmVtZW50KCk7XG4gICAgICAgIHRoaXMuY3B1Lm1lbW9yeS5zdG9yZUJ5dGUobmV3IEhleChNYXRoLmZsb29yKChudW1iZXJUb1N0b3JlIC8gMTApICUgMTApKSwgbWVtb3J5TG9jYXRpb24pO1xuICAgICAgICBtZW1vcnlMb2NhdGlvbi5pbmNyZW1lbnQoKTtcbiAgICAgICAgdGhpcy5jcHUubWVtb3J5LnN0b3JlQnl0ZShuZXcgSGV4KE1hdGguZmxvb3IoKG51bWJlclRvU3RvcmUgJSAxMDApICUgMTApKSwgbWVtb3J5TG9jYXRpb24pO1xuICAgIH1cbn1cblxuTGRCVnguaW5zdHJ1Y3Rpb25SZWdleCA9IFwiZi4zM1wiOyIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgSW5zdHJ1Y3Rpb25IYW5kbGVyIGZyb20gXCIuL0luc3RydWN0aW9uSGFuZGxlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMZER0VnggZXh0ZW5kcyBJbnN0cnVjdGlvbkhhbmRsZXIge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtPcENvZGV9IG9wQ29kZVxuICAgICAqL1xuICAgIGV4ZWN1dGUob3BDb2RlKSB7XG4gICAgICAgIHRoaXMuY3B1LmRlbGF5VGltZXIgPSB0aGlzLmNwdS5yZWdpc3RlcnMucmVhZChvcENvZGUuaGV4KDEpKS5jb3B5KCk7XG4gICAgfVxufVxuXG5MZER0VnguaW5zdHJ1Y3Rpb25SZWdleCA9IFwiZi4xNVwiOyIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgSW5zdHJ1Y3Rpb25IYW5kbGVyIGZyb20gXCIuL0luc3RydWN0aW9uSGFuZGxlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMZEZWeCBleHRlbmRzIEluc3RydWN0aW9uSGFuZGxlciB7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge09wQ29kZX0gb3BDb2RlXG4gICAgICovXG4gICAgZXhlY3V0ZShvcENvZGUpIHtcbiAgICAgICAgdGhpcy5jcHUucmVnaXN0ZXJJLnZhbHVlID0gKHBhcnNlSW50KHRoaXMuY3B1LnJlZ2lzdGVycy5yZWFkKG9wQ29kZS5oZXgoMSkpLnZhbHVlLCAxNikgKiA1KS50b1N0cmluZygxNik7XG4gICAgfVxufVxuXG5MZEZWeC5pbnN0cnVjdGlvblJlZ2V4ID0gXCJmLjI5XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBJbnN0cnVjdGlvbkhhbmRsZXIgZnJvbSBcIi4vSW5zdHJ1Y3Rpb25IYW5kbGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExkSUFkZHIgZXh0ZW5kcyBJbnN0cnVjdGlvbkhhbmRsZXIge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtPcENvZGV9IG9wQ29kZVxuICAgICAqL1xuICAgIGV4ZWN1dGUob3BDb2RlKSB7XG4gICAgICAgIHRoaXMuY3B1LnJlZ2lzdGVySS52YWx1ZSA9IG9wQ29kZS5oZXgoMSwgMykudmFsdWU7XG4gICAgfVxufVxuXG5MZElBZGRyLmluc3RydWN0aW9uUmVnZXggPSBcImEuLi5cIjsiLCJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IEluc3RydWN0aW9uSGFuZGxlciBmcm9tIFwiLi9JbnN0cnVjdGlvbkhhbmRsZXJcIjtcbmltcG9ydCBIZXggZnJvbSBcIi4vLi4vSGV4XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExkSVZ4IGV4dGVuZHMgSW5zdHJ1Y3Rpb25IYW5kbGVyIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T3BDb2RlfSBvcENvZGVcbiAgICAgKi9cbiAgICBleGVjdXRlKG9wQ29kZSkge1xuICAgICAgICBsZXQgZGVjaW1hbFggPSBvcENvZGUuaGV4KDEpLnRvRGVjKCk7XG4gICAgICAgIGxldCByZWdpc3RlcklDb3B5ID0gdGhpcy5jcHUucmVnaXN0ZXJJLmNvcHkoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBkZWNpbWFsWDsgaSArPSAxKSB7XG4gICAgICAgICAgICBsZXQgcmVnaXN0ZXJDb3B5ID0gdGhpcy5jcHUucmVnaXN0ZXJzLnJlYWQobmV3IEhleChpLnRvU3RyaW5nKDE2KSkpLmNvcHkoKTtcbiAgICAgICAgICAgIHRoaXMuY3B1Lm1lbW9yeS5zdG9yZUJ5dGUocmVnaXN0ZXJDb3B5LCByZWdpc3RlcklDb3B5KTtcbiAgICAgICAgICAgIC8vIHRoaXMuY3B1LnJlZ2lzdGVySS5pbmNyZW1lbnQoKTtcbiAgICAgICAgICAgIHJlZ2lzdGVySUNvcHkuaW5jcmVtZW50KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkxkSVZ4Lmluc3RydWN0aW9uUmVnZXggPSBcImYuNTVcIjsiLCJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IEluc3RydWN0aW9uSGFuZGxlciBmcm9tIFwiLi9JbnN0cnVjdGlvbkhhbmRsZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGRTdFZ4IGV4dGVuZHMgSW5zdHJ1Y3Rpb25IYW5kbGVyIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T3BDb2RlfSBvcENvZGVcbiAgICAgKi9cbiAgICBleGVjdXRlKG9wQ29kZSkge1xuICAgICAgICB0aGlzLmNwdS5zb3VuZFRpbWVyID0gdGhpcy5jcHUucmVnaXN0ZXJzLnJlYWQob3BDb2RlLmhleCgxKSkuY29weSgpO1xuICAgIH1cbn1cblxuTGRTdFZ4Lmluc3RydWN0aW9uUmVnZXggPSBcImYuMThcIjsiLCJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IEluc3RydWN0aW9uSGFuZGxlciBmcm9tIFwiLi9JbnN0cnVjdGlvbkhhbmRsZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGRWeEJ5dGUgZXh0ZW5kcyBJbnN0cnVjdGlvbkhhbmRsZXIge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtPcENvZGV9IG9wQ29kZVxuICAgICAqL1xuICAgIGV4ZWN1dGUob3BDb2RlKSB7XG4gICAgICAgIHRoaXMuY3B1LnJlZ2lzdGVycy5zdG9yZShvcENvZGUuaGV4KDEpLCBvcENvZGUuaGV4KDIsIDIpKTtcbiAgICB9XG59XG5cbkxkVnhCeXRlLmluc3RydWN0aW9uUmVnZXggPSBcIjYuLi5cIjsiLCJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IEluc3RydWN0aW9uSGFuZGxlciBmcm9tIFwiLi9JbnN0cnVjdGlvbkhhbmRsZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGRWeER0IGV4dGVuZHMgSW5zdHJ1Y3Rpb25IYW5kbGVyIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T3BDb2RlfSBvcENvZGVcbiAgICAgKi9cbiAgICBleGVjdXRlKG9wQ29kZSkge1xuICAgICAgICB0aGlzLmNwdS5yZWdpc3RlcnMuc3RvcmUob3BDb2RlLmhleCgxKSwgdGhpcy5jcHUuZGVsYXlUaW1lci5jb3B5KCkpO1xuICAgIH1cbn1cblxuTGRWeER0Lmluc3RydWN0aW9uUmVnZXggPSBcImYuMDdcIjsiLCJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IEluc3RydWN0aW9uSGFuZGxlciBmcm9tIFwiLi9JbnN0cnVjdGlvbkhhbmRsZXJcIjtcbmltcG9ydCBIZXggZnJvbSBcIi4vLi4vSGV4XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExkVnhJIGV4dGVuZHMgSW5zdHJ1Y3Rpb25IYW5kbGVyIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T3BDb2RlfSBvcENvZGVcbiAgICAgKi9cbiAgICBleGVjdXRlKG9wQ29kZSkge1xuICAgICAgICBsZXQgZGVjaW1hbFggPSBvcENvZGUuaGV4KDEpLnRvRGVjKCk7XG4gICAgICAgIGxldCByZWdpc3RlcklDb3B5ID0gdGhpcy5jcHUucmVnaXN0ZXJJLmNvcHkoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBkZWNpbWFsWDsgaSArPSAxKSB7XG4gICAgICAgICAgICBsZXQgbWVtb3J5Q29weSA9IHRoaXMuY3B1Lm1lbW9yeS5yZWFkQnl0ZShyZWdpc3RlcklDb3B5KS5jb3B5KCk7XG4gICAgICAgICAgICBtZW1vcnlDb3B5LnRvUmVnaXN0ZXIoKTtcbiAgICAgICAgICAgIHRoaXMuY3B1LnJlZ2lzdGVycy5zdG9yZShuZXcgSGV4KGkudG9TdHJpbmcoMTYpKSwgbWVtb3J5Q29weSk7XG4gICAgICAgICAgICByZWdpc3RlcklDb3B5LmluY3JlbWVudCgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5MZFZ4SS5pbnN0cnVjdGlvblJlZ2V4ID0gXCJmLjY1XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBJbnN0cnVjdGlvbkhhbmRsZXIgZnJvbSBcIi4vSW5zdHJ1Y3Rpb25IYW5kbGVyXCI7XG5pbXBvcnQgSGV4IGZyb20gXCIuLy4uL0hleFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMZFZ4SyBleHRlbmRzIEluc3RydWN0aW9uSGFuZGxlciB7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge09wQ29kZX0gb3BDb2RlXG4gICAgICovXG4gICAgZXhlY3V0ZShvcENvZGUpIHtcbiAgICAgICAgdGhpcy5jcHUud2FpdCA9IHRydWU7XG4gICAgICAgIHRoaXMuY3B1LmtleWJvYXJkLm9uRG93bigoa2V5KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbkRvd24ob3BDb2RlLCBrZXkpO1xuICAgICAgICAgICAgdGhpcy5jcHUud2FpdCA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge09wQ29kZX0gb3BDb2RlXG4gICAgICogQHBhcmFtIHtLZXl9IGtleVxuICAgICAqL1xuICAgIGJ1dHRvbkRvd24ob3BDb2RlLCBrZXkpIHtcbiAgICAgICAgdGhpcy5jcHUucmVnaXN0ZXJzLnN0b3JlKG9wQ29kZS5oZXgoMSksIG5ldyBIZXgoa2V5LmNoaXA4TmFtZSkpO1xuICAgIH1cbn1cblxuTGRWeEsuaW5zdHJ1Y3Rpb25SZWdleCA9IFwiZi4wYVwiOyIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgSW5zdHJ1Y3Rpb25IYW5kbGVyIGZyb20gXCIuL0luc3RydWN0aW9uSGFuZGxlclwiO1xuaW1wb3J0IEhleCBmcm9tIFwiLi8uLi9IZXhcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGRWeFZ5IGV4dGVuZHMgSW5zdHJ1Y3Rpb25IYW5kbGVyIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T3BDb2RlfSBvcENvZGVcbiAgICAgKi9cbiAgICBleGVjdXRlKG9wQ29kZSkge1xuICAgICAgICB0aGlzLmNwdS5yZWdpc3RlcnMuc3RvcmUob3BDb2RlLmhleCgxKSwgdGhpcy5jcHUucmVnaXN0ZXJzLnJlYWQob3BDb2RlLmhleCgyKSkuY29weSgpKTtcbiAgICB9XG59XG5cbkxkVnhWeS5pbnN0cnVjdGlvblJlZ2V4ID0gXCI4Li4wXCI7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBJbnN0cnVjdGlvbkhhbmRsZXIgZnJvbSBcIi4vSW5zdHJ1Y3Rpb25IYW5kbGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9yVnhWeSBleHRlbmRzIEluc3RydWN0aW9uSGFuZGxlciB7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge09wQ29kZX0gb3BDb2RlXG4gICAgICovXG4gICAgZXhlY3V0ZShvcENvZGUpIHtcbiAgICAgICAgbGV0IHZ4VmFsdWUgPSB0aGlzLmNwdS5yZWdpc3RlcnMucmVhZChvcENvZGUuaGV4KDEpKTtcbiAgICAgICAgbGV0IHZ5VmFsdWUgPSB0aGlzLmNwdS5yZWdpc3RlcnMucmVhZChvcENvZGUuaGV4KDIpKTtcbiAgICAgICAgdnhWYWx1ZS5vcih2eVZhbHVlKTtcbiAgICB9XG59XG5cbk9yVnhWeS5pbnN0cnVjdGlvblJlZ2V4ID0gXCI4Li4xXCI7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBJbnN0cnVjdGlvbkhhbmRsZXIgZnJvbSBcIi4vSW5zdHJ1Y3Rpb25IYW5kbGVyXCI7XG5pbXBvcnQgSGV4IGZyb20gXCIuLy4uL0hleFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXQgZXh0ZW5kcyBJbnN0cnVjdGlvbkhhbmRsZXIge1xuICAgIGV4ZWN1dGUoKSB7XG4gICAgICAgIHRoaXMuY3B1LnBjLmp1bXBUbyhuZXcgSGV4KHRoaXMuY3B1LnN0YWNrLnJldHJpZXZlKCkudmFsdWUpKTtcbiAgICB9XG59XG5cblJldC5pbnN0cnVjdGlvblJlZ2V4ID0gXCIwMGVlXCI7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBJbnN0cnVjdGlvbkhhbmRsZXIgZnJvbSBcIi4vSW5zdHJ1Y3Rpb25IYW5kbGVyXCI7XG5pbXBvcnQgSGV4IGZyb20gXCIuLy4uL0hleFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSbmRWeEJ5dGUgZXh0ZW5kcyBJbnN0cnVjdGlvbkhhbmRsZXIge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtPcENvZGV9IG9wQ29kZVxuICAgICAqL1xuICAgIGV4ZWN1dGUob3BDb2RlKSB7XG4gICAgICAgIGxldCB2eFZhbHVlID0gdGhpcy5jcHUucmVnaXN0ZXJzLnJlYWQob3BDb2RlLmhleCgxLCAxKSk7XG4gICAgICAgIGxldCBrayA9IG9wQ29kZS5oZXgoMiwgMik7XG4gICAgICAgIGxldCByYW5kb20gPSBIZXgucmFuZG9tKG5ldyBIZXgoXCJmZlwiKSk7XG4gICAgICAgIHJhbmRvbS5hbmQoa2spO1xuICAgICAgICB2eFZhbHVlLnZhbHVlID0gcmFuZG9tLnZhbHVlO1xuICAgIH1cbn1cblxuUm5kVnhCeXRlLmluc3RydWN0aW9uUmVnZXggPSBcImMuLi5cIjsiLCJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IEluc3RydWN0aW9uSGFuZGxlciBmcm9tIFwiLi9JbnN0cnVjdGlvbkhhbmRsZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VWeEJ5dGUgZXh0ZW5kcyBJbnN0cnVjdGlvbkhhbmRsZXIge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtPcENvZGV9IG9wQ29kZVxuICAgICAqL1xuICAgIGV4ZWN1dGUob3BDb2RlKSB7XG4gICAgICAgIGxldCByZWdpc3RlclZhbHVlID0gdGhpcy5jcHUucmVnaXN0ZXJzLnJlYWQob3BDb2RlLmhleCgxKSk7XG4gICAgICAgIGlmIChyZWdpc3RlclZhbHVlLmlzRXF1YWxUbyhvcENvZGUuaGV4KDIsIDIpKSkge1xuICAgICAgICAgICAgdGhpcy5jcHUucGMuc2tpcEluc3RydWN0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblNlVnhCeXRlLmluc3RydWN0aW9uUmVnZXggPSBcIjMuLi5cIjsiLCJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IEluc3RydWN0aW9uSGFuZGxlciBmcm9tIFwiLi9JbnN0cnVjdGlvbkhhbmRsZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VWeFZ5IGV4dGVuZHMgSW5zdHJ1Y3Rpb25IYW5kbGVyIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T3BDb2RlfSBvcENvZGVcbiAgICAgKi9cbiAgICBleGVjdXRlKG9wQ29kZSkge1xuICAgICAgICBsZXQgeFJlZ2lzdGVyVmFsdWUgPSB0aGlzLmNwdS5yZWdpc3RlcnMucmVhZChvcENvZGUuaGV4KDEpKTtcbiAgICAgICAgbGV0IHlSZWdpc3RlclZhbHVlID0gdGhpcy5jcHUucmVnaXN0ZXJzLnJlYWQob3BDb2RlLmhleCgyKSk7XG4gICAgICAgIGlmICh4UmVnaXN0ZXJWYWx1ZS5pc0VxdWFsVG8oeVJlZ2lzdGVyVmFsdWUpKSB7XG4gICAgICAgICAgICB0aGlzLmNwdS5wYy5za2lwSW5zdHJ1Y3Rpb24oKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuU2VWeFZ5Lmluc3RydWN0aW9uUmVnZXggPSBcIjUuLjBcIjsiLCJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IEluc3RydWN0aW9uSGFuZGxlciBmcm9tIFwiLi9JbnN0cnVjdGlvbkhhbmRsZXJcIjtcbmltcG9ydCBIZXggZnJvbSBcIi4vLi4vSGV4XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNobFZ4VnkgZXh0ZW5kcyBJbnN0cnVjdGlvbkhhbmRsZXIge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtPcENvZGV9IG9wQ29kZVxuICAgICAqL1xuICAgIGV4ZWN1dGUob3BDb2RlKSB7XG4gICAgICAgIGxldCB2eFZhbHVlID0gdGhpcy5jcHUucmVnaXN0ZXJzLnJlYWQob3BDb2RlLmhleCgxKSk7XG4gICAgICAgIGxldCBtb3N0U2lnbmlmaWNhbnRCaXQgPSBuZXcgSGV4KCgodnhWYWx1ZS50b0RlYygpICYgMHg4MCkgPT09IDApID8gXCIwXCIgOiBcIjFcIik7XG4gICAgICAgIHRoaXMuY3B1LnJlZ2lzdGVycy5zdG9yZShuZXcgSGV4KFwiZlwiKSwgbW9zdFNpZ25pZmljYW50Qml0KTtcblxuICAgICAgICB2eFZhbHVlLm11bHRpcGx5QnlUd28odHJ1ZSk7XG4gICAgfVxufVxuXG5TaGxWeFZ5Lmluc3RydWN0aW9uUmVnZXggPSBcIjguLmVcIjsiLCJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IEluc3RydWN0aW9uSGFuZGxlciBmcm9tIFwiLi9JbnN0cnVjdGlvbkhhbmRsZXJcIjtcbmltcG9ydCBIZXggZnJvbSBcIi4vLi4vSGV4XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoclZ4VnkgZXh0ZW5kcyBJbnN0cnVjdGlvbkhhbmRsZXIge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtPcENvZGV9IG9wQ29kZVxuICAgICAqL1xuICAgIGV4ZWN1dGUob3BDb2RlKSB7XG4gICAgICAgIGxldCB2eFZhbHVlID0gdGhpcy5jcHUucmVnaXN0ZXJzLnJlYWQob3BDb2RlLmhleCgxKSk7XG4gICAgICAgIHRoaXMuY3B1LnJlZ2lzdGVycy5zdG9yZShuZXcgSGV4KFwiZlwiKSwgbmV3IEhleCgodnhWYWx1ZS50b0RlYygpICYgMHgwMSkudG9TdHJpbmcoMTYpKSk7XG5cbiAgICAgICAgdnhWYWx1ZS5kaXZpZGVCeVR3byh0cnVlKTtcbiAgICB9XG59XG5cblNoclZ4VnkuaW5zdHJ1Y3Rpb25SZWdleCA9IFwiOC4uNlwiOyIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgSW5zdHJ1Y3Rpb25IYW5kbGVyIGZyb20gXCIuL0luc3RydWN0aW9uSGFuZGxlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTa25wVnggZXh0ZW5kcyBJbnN0cnVjdGlvbkhhbmRsZXIge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtPcENvZGV9IG9wQ29kZVxuICAgICAqL1xuICAgIGV4ZWN1dGUob3BDb2RlKSB7XG4gICAgICAgIGlmICghdGhpcy5jcHUua2V5Ym9hcmQuaXNEb3duKHRoaXMuY3B1LnJlZ2lzdGVycy5yZWFkKG9wQ29kZS5oZXgoMSkpLnJlYWxWYWx1ZSgpKSkge1xuICAgICAgICAgICAgdGhpcy5jcHUucGMuc2tpcEluc3RydWN0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblNrbnBWeC5pbnN0cnVjdGlvblJlZ2V4ID0gXCJlLmExXCI7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBJbnN0cnVjdGlvbkhhbmRsZXIgZnJvbSBcIi4vSW5zdHJ1Y3Rpb25IYW5kbGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNrcFZ4IGV4dGVuZHMgSW5zdHJ1Y3Rpb25IYW5kbGVyIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T3BDb2RlfSBvcENvZGVcbiAgICAgKi9cbiAgICBleGVjdXRlKG9wQ29kZSkge1xuICAgICAgICBpZiAodGhpcy5jcHUua2V5Ym9hcmQuaXNEb3duKHRoaXMuY3B1LnJlZ2lzdGVycy5yZWFkKG9wQ29kZS5oZXgoMSkpLnJlYWxWYWx1ZSgpKSkge1xuICAgICAgICAgICAgdGhpcy5jcHUucGMuc2tpcEluc3RydWN0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblNrcFZ4Lmluc3RydWN0aW9uUmVnZXggPSBcImUuOWVcIjsiLCJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IEluc3RydWN0aW9uSGFuZGxlciBmcm9tIFwiLi9JbnN0cnVjdGlvbkhhbmRsZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU25lVnhCeXRlIGV4dGVuZHMgSW5zdHJ1Y3Rpb25IYW5kbGVyIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T3BDb2RlfSBvcENvZGVcbiAgICAgKi9cbiAgICBleGVjdXRlKG9wQ29kZSkge1xuICAgICAgICBsZXQgcmVnaXN0ZXJWYWx1ZSA9IHRoaXMuY3B1LnJlZ2lzdGVycy5yZWFkKG9wQ29kZS5oZXgoMSkpO1xuICAgICAgICBpZiAoIXJlZ2lzdGVyVmFsdWUuaXNFcXVhbFRvKG9wQ29kZS5oZXgoMiwgMikpKSB7XG4gICAgICAgICAgICB0aGlzLmNwdS5wYy5za2lwSW5zdHJ1Y3Rpb24oKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuU25lVnhCeXRlLmluc3RydWN0aW9uUmVnZXggPSBcIjQuLi5cIjsiLCJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IEluc3RydWN0aW9uSGFuZGxlciBmcm9tIFwiLi9JbnN0cnVjdGlvbkhhbmRsZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU25lVnhWeSBleHRlbmRzIEluc3RydWN0aW9uSGFuZGxlciB7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge09wQ29kZX0gb3BDb2RlXG4gICAgICovXG4gICAgZXhlY3V0ZShvcENvZGUpIHtcbiAgICAgICAgbGV0IHZ4VmFsdWUgPSB0aGlzLmNwdS5yZWdpc3RlcnMucmVhZChvcENvZGUuaGV4KDEpKTtcbiAgICAgICAgbGV0IHZ5VmFsdWUgPSB0aGlzLmNwdS5yZWdpc3RlcnMucmVhZChvcENvZGUuaGV4KDIpKTtcbiAgICAgICAgaWYgKCF2eFZhbHVlLmlzRXF1YWxUbyh2eVZhbHVlKSkge1xuICAgICAgICAgICAgdGhpcy5jcHUucGMuc2tpcEluc3RydWN0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblNuZVZ4VnkuaW5zdHJ1Y3Rpb25SZWdleCA9IFwiOS4uMFwiOyIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgSW5zdHJ1Y3Rpb25IYW5kbGVyIGZyb20gXCIuL0luc3RydWN0aW9uSGFuZGxlclwiO1xuaW1wb3J0IEhleCBmcm9tIFwiLi8uLi9IZXhcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3ViVnhWeSBleHRlbmRzIEluc3RydWN0aW9uSGFuZGxlciB7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge09wQ29kZX0gb3BDb2RlXG4gICAgICovXG4gICAgZXhlY3V0ZShvcENvZGUpIHtcbiAgICAgICAgbGV0IHZ4VmFsdWUgPSB0aGlzLmNwdS5yZWdpc3RlcnMucmVhZChvcENvZGUuaGV4KDEpKTtcbiAgICAgICAgbGV0IHZ5VmFsdWUgPSB0aGlzLmNwdS5yZWdpc3RlcnMucmVhZChvcENvZGUuaGV4KDIpKTtcblxuICAgICAgICBsZXQgY2FycnkgPSB2eFZhbHVlLnN1YnRyYWN0KHZ5VmFsdWUsIHRydWUpO1xuICAgICAgICBjYXJyeSA9IGNhcnJ5ID8gbmV3IEhleChcIjFcIikgOiBuZXcgSGV4KFwiMFwiKTtcbiAgICAgICAgdGhpcy5jcHUucmVnaXN0ZXJzLnN0b3JlKG5ldyBIZXgoXCJmXCIpLCBjYXJyeSk7XG4gICAgfVxufVxuXG5TdWJWeFZ5Lmluc3RydWN0aW9uUmVnZXggPSBcIjguLjVcIjsiLCJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IEluc3RydWN0aW9uSGFuZGxlciBmcm9tIFwiLi9JbnN0cnVjdGlvbkhhbmRsZXJcIjtcbmltcG9ydCBIZXggZnJvbSBcIi4vLi4vSGV4XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN1Ym5WeFZ5IGV4dGVuZHMgSW5zdHJ1Y3Rpb25IYW5kbGVyIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T3BDb2RlfSBvcENvZGVcbiAgICAgKi9cbiAgICBleGVjdXRlKG9wQ29kZSkge1xuICAgICAgICBsZXQgdnhWYWx1ZSA9IHRoaXMuY3B1LnJlZ2lzdGVycy5yZWFkKG9wQ29kZS5oZXgoMSkpO1xuICAgICAgICBsZXQgdnlWYWx1ZSA9IHRoaXMuY3B1LnJlZ2lzdGVycy5yZWFkKG9wQ29kZS5oZXgoMikpO1xuICAgICAgICBsZXQgY29waWVkVnkgPSB2eVZhbHVlLmNvcHkoKTtcblxuICAgICAgICBsZXQgY2FycnkgPSBjb3BpZWRWeS5zdWJ0cmFjdCh2eFZhbHVlLCB0cnVlKTtcbiAgICAgICAgY2FycnkgPSBjYXJyeSA/IG5ldyBIZXgoXCIxXCIpIDogbmV3IEhleChcIjBcIik7XG4gICAgICAgIHRoaXMuY3B1LnJlZ2lzdGVycy5zdG9yZShuZXcgSGV4KFwiZlwiKSwgY2FycnkpO1xuXG4gICAgICAgIHZ4VmFsdWUudmFsdWUgPSBjb3BpZWRWeS52YWx1ZTtcbiAgICB9XG59XG5cblN1Ym5WeFZ5Lmluc3RydWN0aW9uUmVnZXggPSBcIjguLjdcIjsiLCJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IEluc3RydWN0aW9uSGFuZGxlciBmcm9tIFwiLi9JbnN0cnVjdGlvbkhhbmRsZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgWG9yVnhWeSBleHRlbmRzIEluc3RydWN0aW9uSGFuZGxlciB7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge09wQ29kZX0gb3BDb2RlXG4gICAgICovXG4gICAgZXhlY3V0ZShvcENvZGUpIHtcbiAgICAgICAgbGV0IHZ4VmFsdWUgPSB0aGlzLmNwdS5yZWdpc3RlcnMucmVhZChvcENvZGUuaGV4KDEpKTtcbiAgICAgICAgbGV0IHZ5VmFsdWUgPSB0aGlzLmNwdS5yZWdpc3RlcnMucmVhZChvcENvZGUuaGV4KDIpKTtcbiAgICAgICAgdnhWYWx1ZS54b3IodnlWYWx1ZSk7XG4gICAgfVxufVxuXG5Yb3JWeFZ5Lmluc3RydWN0aW9uUmVnZXggPSBcIjguLjNcIjsiLCJcbmltcG9ydCBDbHMgZnJvbSBcIi4vQ2xzXCI7XG5pbXBvcnQgUmV0IGZyb20gXCIuL1JldFwiO1xuaW1wb3J0IEpwQWRkciBmcm9tIFwiLi9KcEFkZHJcIjtcbmltcG9ydCBDYWxsQWRkciBmcm9tIFwiLi9DYWxsQWRkclwiO1xuaW1wb3J0IFNlVnhCeXRlIGZyb20gXCIuL1NlVnhCeXRlXCI7XG5pbXBvcnQgU25lVnhCeXRlIGZyb20gXCIuL1NuZVZ4Qnl0ZVwiO1xuaW1wb3J0IFNlVnhWeSBmcm9tIFwiLi9TZVZ4VnlcIjtcbmltcG9ydCBMZFZ4Qnl0ZSBmcm9tIFwiLi9MZFZ4Qnl0ZVwiO1xuaW1wb3J0IEFkZFZ4Qnl0ZSBmcm9tIFwiLi9BZGRWeEJ5dGVcIjtcbmltcG9ydCBMZFZ4VnkgZnJvbSBcIi4vTGRWeFZ5XCI7XG5pbXBvcnQgT3JWeFZ5IGZyb20gXCIuL09yVnhWeVwiO1xuaW1wb3J0IEFuZFZ4VnkgZnJvbSBcIi4vQW5kVnhWeVwiO1xuaW1wb3J0IFhvclZ4VnkgZnJvbSBcIi4vWG9yVnhWeVwiO1xuaW1wb3J0IEFkZFZ4VnkgZnJvbSBcIi4vQWRkVnhWeVwiO1xuaW1wb3J0IFN1YlZ4VnkgZnJvbSBcIi4vU3ViVnhWeVwiO1xuaW1wb3J0IFNoclZ4VnkgZnJvbSBcIi4vU2hyVnhWeVwiO1xuaW1wb3J0IFN1Ym5WeFZ5IGZyb20gXCIuL1N1Ym5WeFZ5XCI7XG5pbXBvcnQgU2hsVnhWeSBmcm9tIFwiLi9TaGxWeFZ5XCI7XG5pbXBvcnQgU25lVnhWeSBmcm9tIFwiLi9TbmVWeFZ5XCI7XG5pbXBvcnQgTGRJQWRkciBmcm9tIFwiLi9MZElBZGRyXCI7XG5pbXBvcnQgSnBWb0FkZHIgZnJvbSBcIi4vSnBWb0FkZHJcIjtcbmltcG9ydCBSbmRWeEJ5dGUgZnJvbSBcIi4vUm5kVnhCeXRlXCI7XG5pbXBvcnQgRHJ3VnhWeU5pYmJsZSBmcm9tIFwiLi9EcndWeFZ5TmliYmxlXCI7XG5pbXBvcnQgU2twVnggZnJvbSBcIi4vU2twVnhcIjtcbmltcG9ydCBTa25wVnggZnJvbSBcIi4vU2tucFZ4XCI7XG5pbXBvcnQgTGRWeER0IGZyb20gXCIuL0xkVnhEdFwiO1xuaW1wb3J0IExkVnhLIGZyb20gXCIuL0xkVnhLXCI7XG5pbXBvcnQgTGREdFZ4IGZyb20gXCIuL0xkRHRWeFwiO1xuaW1wb3J0IExkU3RWeCBmcm9tIFwiLi9MZFN0VnhcIjtcbmltcG9ydCBBZGRJVnggZnJvbSBcIi4vQWRkSVZ4XCI7XG5pbXBvcnQgTGRGVnggZnJvbSBcIi4vTGRGVnhcIjtcbmltcG9ydCBMZEJWeCBmcm9tIFwiLi9MZEJWeFwiO1xuaW1wb3J0IExkSVZ4IGZyb20gXCIuL0xkSVZ4XCI7XG5pbXBvcnQgTGRWeEkgZnJvbSBcIi4vTGRWeElcIjtcblxuZXhwb3J0IGRlZmF1bHQgW1xuICAgIENscyxcbiAgICBSZXQsXG4gICAgSnBBZGRyLFxuICAgIENhbGxBZGRyLFxuICAgIFNlVnhCeXRlLFxuICAgIFNuZVZ4Qnl0ZSxcbiAgICBTZVZ4VnksXG4gICAgTGRWeEJ5dGUsXG4gICAgQWRkVnhCeXRlLFxuICAgIExkVnhWeSxcbiAgICBPclZ4VnksXG4gICAgQW5kVnhWeSxcbiAgICBYb3JWeFZ5LFxuICAgIEFkZFZ4VnksXG4gICAgU3ViVnhWeSxcbiAgICBTaHJWeFZ5LFxuICAgIFN1Ym5WeFZ5LFxuICAgIFNobFZ4VnksXG4gICAgU25lVnhWeSxcbiAgICBMZElBZGRyLFxuICAgIEpwVm9BZGRyLFxuICAgIFJuZFZ4Qnl0ZSxcbiAgICBEcndWeFZ5TmliYmxlLFxuICAgIFNrcFZ4LFxuICAgIFNrbnBWeCxcbiAgICBMZFZ4RHQsXG4gICAgTGRWeEssXG4gICAgTGREdFZ4LFxuICAgIExkU3RWeCxcbiAgICBBZGRJVngsXG4gICAgTGRGVngsXG4gICAgTGRCVngsXG4gICAgTGRJVngsXG4gICAgTGRWeElcbl07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmxldCBTVEFURSA9IHtcbiAgICBVUDogMCxcbiAgICBET1dOOiAxXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBLZXkge1xuICAgIGNvbnN0cnVjdG9yKGNoaXA4TmFtZSwga2V5Ym9hcmROYW1lKSB7XG4gICAgICAgIHRoaXMuY2hpcDhOYW1lID0gY2hpcDhOYW1lO1xuICAgICAgICB0aGlzLmtleWJvYXJkTmFtZSA9IGtleWJvYXJkTmFtZTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFNUQVRFLlVQO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgbWV0aG9kIGNhbiBiZSBleHRlbmRlZCB0byBwcm92aWRlIG11bHRpcGxlIGtleWJvYXJkIGtleXMgc3VwcG9ydCBtYXBwZWRcbiAgICAgKiB0byBzaW5nbGUgY2hpcDgga2V5LlxuICAgICAqIEBwYXJhbSBrZXlib2FyZEtleU5hbWVcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBpc0tleU1hcHBlZChrZXlib2FyZEtleU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMua2V5Ym9hcmROYW1lID09IGtleWJvYXJkS2V5TmFtZTtcbiAgICB9XG5cbiAgICBkb3duKCkge1xuICAgICAgICB0aGlzLnN0YXRlID0gU1RBVEUuRE9XTjtcbiAgICB9XG5cbiAgICB1cCgpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFNUQVRFLlVQO1xuICAgIH1cblxuICAgIGlzVXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlID09IFNUQVRFLlVQO1xuICAgIH1cblxuICAgIGlzRG93bigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUgPT0gU1RBVEUuRE9XTjtcbiAgICB9XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBLZXkgZnJvbSBcIi4vS2V5XCI7XG5cbmxldCBrZXlzU2V0ID0gbmV3IFNldChcbiAgICBbXG4gICAgICAgIG5ldyBLZXkoXCIxXCIsIFwiMVwiKSwgbmV3IEtleShcIjJcIiwgXCIyXCIpLCBuZXcgS2V5KFwiM1wiLCBcIjNcIiksIG5ldyBLZXkoXCJjXCIsIFwiNFwiKSxcbiAgICAgICAgbmV3IEtleShcIjRcIiwgXCJxXCIpLCBuZXcgS2V5KFwiNVwiLCBcIndcIiksIG5ldyBLZXkoXCI2XCIsIFwiZVwiKSwgbmV3IEtleShcImRcIiwgXCJyXCIpLFxuICAgICAgICBuZXcgS2V5KFwiN1wiLCBcImFcIiksIG5ldyBLZXkoXCI4XCIsIFwic1wiKSwgbmV3IEtleShcIjlcIiwgXCJkXCIpLCBuZXcgS2V5KFwiZVwiLCBcImZcIiksXG4gICAgICAgIG5ldyBLZXkoXCJhXCIsIFwielwiKSwgbmV3IEtleShcIjBcIiwgXCJ4XCIpLCBuZXcgS2V5KFwiYlwiLCBcImNcIiksIG5ldyBLZXkoXCJmXCIsIFwidlwiKVxuICAgIF1cbik7XG5cbmV4cG9ydCB7IGtleXNTZXQgfTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFwIHtcbiAgICBrZXlEb3duKGtleWJvYXJkS2V5TmFtZSkge1xuICAgICAgICBsZXQga2V5T2JqZWN0ID0gdGhpcy5rZXlCeUtleWJvYXJkTmFtZShrZXlib2FyZEtleU5hbWUpO1xuICAgICAgICBpZiAoa2V5T2JqZWN0ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAga2V5T2JqZWN0LmRvd24oKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ga2V5T2JqZWN0O1xuICAgIH1cblxuICAgIGtleVVwKGtleWJvYXJkS2V5TmFtZSkge1xuICAgICAgICBsZXQga2V5T2JqZWN0ID0gdGhpcy5rZXlCeUtleWJvYXJkTmFtZShrZXlib2FyZEtleU5hbWUpO1xuICAgICAgICBpZiAoa2V5T2JqZWN0ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAga2V5T2JqZWN0LnVwKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGtleU9iamVjdDtcbiAgICB9XG5cbiAgICBpc0Rvd24oY2hpcDhOYW1lKSB7XG4gICAgICAgIGxldCBrZXlPYmplY3QgPSB0aGlzLmtleUJ5Q2hpcDhOYW1lKGNoaXA4TmFtZSk7XG4gICAgICAgIGlmIChrZXlPYmplY3QgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4ga2V5T2JqZWN0LmlzRG93bigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpc1VwKGNoaXA4TmFtZSkge1xuICAgICAgICBsZXQga2V5T2JqZWN0ID0gdGhpcy5rZXlCeUNoaXA4TmFtZShjaGlwOE5hbWUpO1xuICAgICAgICBpZiAoa2V5T2JqZWN0ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGtleU9iamVjdC5pc1VwKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGtleUJ5S2V5Ym9hcmROYW1lKGtleWJvYXJkS2V5TmFtZSkge1xuXG4gICAgICAgIGZvciAobGV0IGtleSBvZiBrZXlzU2V0KSB7XG4gICAgICAgICAgICBpZiAoa2V5LmlzS2V5TWFwcGVkKGtleWJvYXJkS2V5TmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBrZXlCeUNoaXA4TmFtZShuYW1lKSB7XG4gICAgICAgIGZvciAobGV0IGtleSBvZiBrZXlzU2V0KSB7XG4gICAgICAgICAgICBpZiAoa2V5LmNoaXA4TmFtZSA9PSBuYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IEhleCBmcm9tIFwiLi9IZXhcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3BDb2RlIGV4dGVuZHMgSGV4IHtcbiAgICBoZXgocG9zaXRpb24sIG5pYmJsZXNUb1JlYWQgPSAxKSB7XG4gICAgICAgIHJldHVybiBuZXcgSGV4KHRoaXMudmFsdWUuc3Vic3RyaW5nKHBvc2l0aW9uLCBwb3NpdGlvbiArIG5pYmJsZXNUb1JlYWQpKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZnJvbU1lbW9yeUNodW5rKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBPcENvZGUoZGF0YVswXS52YWx1ZSArIGRhdGFbMV0udmFsdWUpO1xuICAgIH1cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgSGV4IGZyb20gXCIuL0hleFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQQyBleHRlbmRzIEhleCB7XG4gICAgY29uc3RydWN0b3IodmFsdWUpIHtcbiAgICAgICAgc3VwZXIodmFsdWUpO1xuXG4gICAgICAgIHRoaXMuanVtcGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgbmV4dEluc3RydWN0aW9uKCkge1xuICAgICAgICB0aGlzLmFkZChuZXcgSGV4KFwiMDJcIikpO1xuICAgIH1cblxuICAgIHNraXBJbnN0cnVjdGlvbigpIHtcbiAgICAgICAgdGhpcy5hZGQobmV3IEhleChcIjA0XCIpKTtcbiAgICAgICAgdGhpcy5qdW1wZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7SGV4fSBoZXhcbiAgICAgKi9cbiAgICBqdW1wVG8oaGV4KSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSBoZXgudmFsdWU7XG4gICAgICAgIHRoaXMuanVtcGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBqdW1wZWRGbGFnKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5qdW1wZWQ7XG4gICAgfVxuXG4gICAgcmVzZXRKdW1wZWRGbGFnKCkge1xuICAgICAgICB0aGlzLmp1bXBlZCA9IGZhbHNlO1xuICAgIH1cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgaW5zdHJ1Y3Rpb25IYW5kbGVycyBmcm9tIFwiLi8uLi9HZW5lcmljL0luc3RydWN0aW9uSGFuZGxlcnMvbG9hZGVyXCI7XG5pbXBvcnQgSGV4IGZyb20gXCIuLy4uL0dlbmVyaWMvSGV4XCI7XG5pbXBvcnQgUEMgZnJvbSBcIi4vLi4vR2VuZXJpYy9QQ1wiO1xuaW1wb3J0IE9wQ29kZSBmcm9tIFwiLi8uLi9HZW5lcmljL09wQ29kZVwiO1xuXG4vKipcbiAqIEBwcm9wZXJ0eSB7U3RhY2t9IHN0YWNrXG4gKiBAcHJvcGVydHkge1BDfSBwY1xuICogQHByb3BlcnR5IHtNZW1vcnl9IG1lbW9yeVxuICogQHByb3BlcnR5IHtSZWdpc3RlcnN9IHJlZ2lzdGVyc1xuICogQHByb3BlcnR5IHtLZXlib2FyZH0ga2V5Ym9hcmRcbiAqIEBwcm9wZXJ0eSB7U2NyZWVufSBzY3JlZW5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ1BVIHtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtNZW1vcnl9IE1lbW9yeVNlcnZpY2VcbiAgICAgKiBAcGFyYW0ge1N0YWNrfSBTdGFja1NlcnZpY2VcbiAgICAgKiBAcGFyYW0ge1JlZ2lzdGVyc30gUmVnaXN0ZXJzU2VydmljZVxuICAgICAqIEBwYXJhbSB7S2V5Ym9hcmR9IEtleWJvYXJkU2VydmljZVxuICAgICAqIEBwYXJhbSB7U2NyZWVufSBTY3JlZW5TZXJ2aWNlXG4gICAgICogQHBhcmFtIHtTcGVha2VyfSBTcGVha2VyU2VydmljZVxuICAgICAqIEBwYXJhbSB7U2V0dGluZ3N9IFNldHRpbmdzU2VydmljZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKE1lbW9yeVNlcnZpY2UsIFN0YWNrU2VydmljZSwgUmVnaXN0ZXJzU2VydmljZSwgS2V5Ym9hcmRTZXJ2aWNlLCBTY3JlZW5TZXJ2aWNlLCBTcGVha2VyU2VydmljZSwgU2V0dGluZ3NTZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMua2V5Ym9hcmQgPSBLZXlib2FyZFNlcnZpY2U7XG4gICAgICAgIHRoaXMubWVtb3J5ID0gTWVtb3J5U2VydmljZTtcbiAgICAgICAgdGhpcy5zdGFjayA9IFN0YWNrU2VydmljZTtcbiAgICAgICAgdGhpcy5yZWdpc3RlcnMgPSBSZWdpc3RlcnNTZXJ2aWNlO1xuICAgICAgICB0aGlzLnNjcmVlbiA9IFNjcmVlblNlcnZpY2U7XG4gICAgICAgIHRoaXMuc3BlYWtlciA9IFNwZWFrZXJTZXJ2aWNlO1xuICAgICAgICB0aGlzLnNldHRpbmdzID0gU2V0dGluZ3NTZXJ2aWNlO1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfVxuXG4gICAgbmV4dEluc3RydWN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy53YWl0KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmV4ZWN1dGluZyA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLnBjLmp1bXBlZEZsYWcoKSkge1xuICAgICAgICAgICAgdGhpcy5wYy5yZXNldEp1bXBlZEZsYWcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGMubmV4dEluc3RydWN0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vcENvZGUgPSBPcENvZGUuZnJvbU1lbW9yeUNodW5rKHRoaXMubWVtb3J5LnJlYWRDaHVuaygyLCB0aGlzLnBjKSk7XG4gICAgICAgIGxldCBpbnN0cnVjdGlvbkhhbmRsZXIgPSB0aGlzLmZpbmRJbnN0cnVjdGlvbkhhbmRsZXIodGhpcy5vcENvZGUpO1xuICAgICAgICBpZiAoaW5zdHJ1Y3Rpb25IYW5kbGVyICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgKG5ldyBpbnN0cnVjdGlvbkhhbmRsZXIodGhpcykpLmV4ZWN1dGUodGhpcy5vcENvZGUpO1xuICAgICAgICAgICAgdGhpcy5uZXh0T3BDb2RlID0gdGhpcy5yZWFkTmV4dE9wQ29kZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJlYWROZXh0T3BDb2RlKCkge1xuICAgICAgICBsZXQgY29weSA9IHRoaXMucGMuY29weSgpO1xuICAgICAgICBpZiAoIXRoaXMucGMuanVtcGVkRmxhZygpKSB7XG4gICAgICAgICAgICBjb3B5LmFkZChuZXcgSGV4KFwiMDJcIikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPcENvZGUuZnJvbU1lbW9yeUNodW5rKHRoaXMubWVtb3J5LnJlYWRDaHVuaygyLCBjb3B5KSk7XG4gICAgfVxuXG4gICAgYW5pbWF0aW9uRnJhbWUoKSB7XG4gICAgICAgIGlmICh0aGlzLmRlbGF5VGltZXIudG9EZWMoKSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuZGVsYXlUaW1lci5kZWNyZW1lbnQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zb3VuZFRpbWVyLnRvRGVjKCkgPiAwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5zb3VuZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3BlYWtlci5zdGFydCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zb3VuZFRpbWVyLmRlY3JlbWVudCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zcGVha2VyLnN0b3AoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T3BDb2RlfSBvcENvZGVcbiAgICAgKiBAcmV0dXJuIHtJbnN0cnVjdGlvbkhhbmRsZXJ8Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBmaW5kSW5zdHJ1Y3Rpb25IYW5kbGVyKG9wQ29kZSkge1xuICAgICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIGluc3RydWN0aW9uSGFuZGxlcnMpIHtcbiAgICAgICAgICAgIGlmIChvcENvZGUudmFsdWUubWF0Y2goaGFuZGxlci5pbnN0cnVjdGlvblJlZ2V4KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBoYW5kbGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldHMgQ1BVIHRvIGluaXRpYWwgc3RhdGVcbiAgICAgKi9cbiAgICByZXNldCgpIHtcbiAgICAgICAgdGhpcy5zb2Z0UmVzZXQoKTtcbiAgICAgICAgdGhpcy5tZW1vcnkucmVzZXQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldHMgQ1BVIHRvIGluaXRpYWwgc3RhdGUgd2l0aG91dCBjbGVhcmluZyBtZW1vcnlcbiAgICAgKi9cbiAgICBzb2Z0UmVzZXQoKSB7XG4gICAgICAgIHRoaXMuZXhlY3V0aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJJID0gbmV3IEhleChcIjBcIik7XG4gICAgICAgIHRoaXMucGMgPSBuZXcgUEMoXCIwXCIpO1xuICAgICAgICB0aGlzLmRlbGF5VGltZXIgPSBuZXcgSGV4KFwiMFwiKTtcbiAgICAgICAgdGhpcy5zb3VuZFRpbWVyID0gbmV3IEhleChcIjBcIik7XG4gICAgICAgIHRoaXMud2FpdCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuc3RhY2sucmVzZXQoKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlcnMucmVzZXQoKTtcbiAgICAgICAgdGhpcy5zY3JlZW4uY2xlYXIoKTtcbiAgICB9XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBLZXlib2FyZE1hcCBmcm9tIFwiLi8uLi9HZW5lcmljL0tleWJvYXJkL01hcFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBLZXlib2FyZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubWFwID0gbmV3IEtleWJvYXJkTWFwKCk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJLZXlEb3duRXZlbnRzKCk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJLZXlVcEV2ZW50cygpO1xuICAgICAgICB0aGlzLndhdGNoZXIgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZWdpc3RlcktleURvd25FdmVudHMoKSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qga2V5TmFtZSA9IGV2ZW50LmtleTtcblxuICAgICAgICAgICAgaWYgKHRoaXMubWFwLmtleURvd24oa2V5TmFtZSkgJiYgdGhpcy53YXRjaGVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53YXRjaGVyKHRoaXMubWFwLmtleUJ5S2V5Ym9hcmROYW1lKGtleU5hbWUpKTtcbiAgICAgICAgICAgICAgICB0aGlzLndhdGNoZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgZmFsc2UpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyS2V5VXBFdmVudHMoKSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGtleU5hbWUgPSBldmVudC5rZXk7XG4gICAgICAgICAgICB0aGlzLm1hcC5rZXlVcChrZXlOYW1lKTtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgIH1cblxuICAgIGlzRG93bihjaGlwOEtleU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwLmlzRG93bihjaGlwOEtleU5hbWUpO1xuICAgIH1cblxuICAgIGlzVXAoY2hpcDhLZXlOYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcC5pc1VwKGNoaXA4S2V5TmFtZSk7XG4gICAgfVxuXG4gICAgb25Eb3duKGNhbGxhYmxlKSB7XG4gICAgICAgIHRoaXMud2F0Y2hlciA9IGNhbGxhYmxlO1xuICAgIH1cbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IEhleCBmcm9tIFwiLi8uLi9HZW5lcmljL0hleFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZW1vcnkge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMubWVtb3J5ID0gW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGJ5dGVzVG9SZWFkXG4gICAgICogQHBhcmFtIHtIZXh9IHBvc2l0aW9uXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIHJlYWRDaHVuayhieXRlc1RvUmVhZCwgcG9zaXRpb24pIHtcbiAgICAgICAgbGV0IGRhdGFSZWFkID0gW107XG4gICAgICAgIGxldCBjdXJyZW50UG9zaXRpb24gPSBwb3NpdGlvbi5jb3B5KCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnl0ZXNUb1JlYWQ7IGkgKz0gMSwgY3VycmVudFBvc2l0aW9uLmluY3JlbWVudCgpKSB7XG4gICAgICAgICAgICBkYXRhUmVhZFtpXSA9IHRoaXMucmVhZEJ5dGUoY3VycmVudFBvc2l0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRhUmVhZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0hleH0gcG9zaXRpb25cbiAgICAgKiBAcmV0dXJucyB7SGV4fVxuICAgICAqL1xuICAgIHJlYWRCeXRlKHBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1lbW9yeVtwb3NpdGlvbi50b0RlYygpXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gYnl0ZXNUb1N0b3JlXG4gICAgICogQHBhcmFtIHtIZXh9IHBvc2l0aW9uXG4gICAgICovXG4gICAgc3RvcmVDaHVuayhieXRlc1RvU3RvcmUsIHBvc2l0aW9uKSB7XG4gICAgICAgIGxldCBjdXJyZW50UG9zaXRpb24gPSBuZXcgSGV4KHBvc2l0aW9uLnZhbHVlKTtcbiAgICAgICAgZm9yIChsZXQgYnl0ZSBvZiBieXRlc1RvU3RvcmUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmVCeXRlKGJ5dGUsIGN1cnJlbnRQb3NpdGlvbik7XG4gICAgICAgICAgICBjdXJyZW50UG9zaXRpb24uaW5jcmVtZW50KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gYnl0ZVxuICAgICAqIEBwYXJhbSB7SGV4fSBwb3NpdGlvblxuICAgICAqL1xuICAgIHN0b3JlQnl0ZShieXRlLCBwb3NpdGlvbikge1xuICAgICAgICBpZiAoIShieXRlIGluc3RhbmNlb2YgSGV4KSkge1xuICAgICAgICAgICAgYnl0ZSA9IG5ldyBIZXgoYnl0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tZW1vcnlbcG9zaXRpb24udG9EZWMoKV0gPSBieXRlO1xuICAgIH1cbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IEhleCBmcm9tIFwiLi8uLi9HZW5lcmljL0hleFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWdpc3RlcnMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnNpemUgPSAxNjtcbiAgICAgICAgdGhpcy5yZWdpc3RlcnMgPSB7fTtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2l6ZTsgaSArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyc1tpLnRvU3RyaW5nKDE2KV0gPSBuZXcgSGV4KFwiMFwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtIZXh9IHBvc2l0aW9uXG4gICAgICogQHJldHVybnMge0hleH1cbiAgICAgKi9cbiAgICByZWFkKHBvc2l0aW9uKSB7XG4gICAgICAgIGlmICghdGhpcy5yZWdpc3RlcnNbcG9zaXRpb24ubG93ZXN0TmliYmxlKCldKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwb3NpdGlvbik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnJlZ2lzdGVyc1twb3NpdGlvbi5sb3dlc3ROaWJibGUoKV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnJlZ2lzdGVyc1twb3NpdGlvbi5sb3dlc3ROaWJibGUoKV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtIZXh9IHBvc2l0aW9uXG4gICAgICogQHBhcmFtIHtIZXh9IHZhbHVlXG4gICAgICovXG4gICAgc3RvcmUocG9zaXRpb24sIHZhbHVlKSB7XG4gICAgICAgIGxldCBjb3B5ID0gdmFsdWUuY29weSgpO1xuICAgICAgICBjb3B5LnZhbHVlID0gKHBhcnNlSW50KGNvcHkudmFsdWUsIDE2KSAmIDB4ZmYpLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgdGhpcy5yZWdpc3RlcnNbcG9zaXRpb24ubG93ZXN0TmliYmxlKCldID0gY29weTtcbiAgICB9XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBIZXggZnJvbSBcIi4vLi4vR2VuZXJpYy9IZXhcIjtcblxubGV0IHN0YXJ0aW5nUG9zaXRpb24gPSA1MTI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvYW1Mb2FkZXIge1xuXG4gICAgY29uc3RydWN0b3IoJHJvb3RTY29wZSkge1xuICAgICAgICB0aGlzLiRyb290U2NvcGUgPSAkcm9vdFNjb3BlO1xuICAgIH1cblxuICAgIGJpbjJoZXgocykge1xuICAgICAgICAvLyAgZGlzY3VzcyBhdDogaHR0cDovL3BocGpzLm9yZy9mdW5jdGlvbnMvYmluMmhleC9cbiAgICAgICAgLy8gb3JpZ2luYWwgYnk6IEtldmluIHZhbiBab25uZXZlbGQgKGh0dHA6Ly9rZXZpbi52YW56b25uZXZlbGQubmV0KVxuICAgICAgICAvLyBidWdmaXhlZCBieTogT25ubyBNYXJzbWFuXG4gICAgICAgIC8vIGJ1Z2ZpeGVkIGJ5OiBMaW51eHdvcmxkXG4gICAgICAgIC8vIGltcHJvdmVkIGJ5OiBudG9uaWF6emkgKGh0dHA6Ly9waHBqcy5vcmcvZnVuY3Rpb25zL2JpbjJoZXg6MzYxI2NvbW1lbnRfMTc3NjE2KVxuICAgICAgICAvLyAgIGV4YW1wbGUgMTogYmluMmhleCgnS2V2Jyk7XG4gICAgICAgIC8vICAgcmV0dXJucyAxOiAnNGI2NTc2J1xuICAgICAgICAvLyAgIGV4YW1wbGUgMjogYmluMmhleChTdHJpbmcuZnJvbUNoYXJDb2RlKDB4MDApKTtcbiAgICAgICAgLy8gICByZXR1cm5zIDI6ICcwMCdcblxuICAgICAgICBsZXQgaSwgbCwgbyA9IFwiXCIsXG4gICAgICAgICAgICBuO1xuXG4gICAgICAgIHMgKz0gXCJcIjtcblxuICAgICAgICBmb3IgKGkgPSAwLCBsID0gcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIG4gPSBzLmNoYXJDb2RlQXQoaSlcbiAgICAgICAgICAgICAgICAudG9TdHJpbmcoMTYpO1xuICAgICAgICAgICAgbyArPSBuLmxlbmd0aCA8IDIgPyBcIjBcIiArIG4gOiBuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG87XG4gICAgfVxuXG4gICAgbG9hZChnYW1lKSB7XG4gICAgICAgIGxldCByb20gPSBbXSxcbiAgICAgICAgICAgIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cbiAgICAgICAgcmVhZGVyLm9uZXJyb3IgPSAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lcnJvckhhbmRsZXIoZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVhZGVyLm9ucHJvZ3Jlc3MgPSAoZSkgPT4ge1xuICAgICAgICAgICAgLy8gdGhpcy51cGRhdGVQcm9ncmVzcyhlKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZWFkZXIub25hYm9ydCA9IChlKSA9PiB7XG4gICAgICAgICAgICAvLyBhbGVydCgnRmlsZSByZWFkIGNhbmNlbGxlZCcpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJlYWRlci5vbmxvYWRzdGFydCA9IChlKSA9PiB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbG9hZGluZyBmaWxlJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVhZGVyLm9ubG9hZCA9IChlKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlYWRlci5yZXN1bHQubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICByb21bc3RhcnRpbmdQb3NpdGlvbiArIGldID0gbmV3IEhleCh0aGlzLmJpbjJoZXgocmVhZGVyLnJlc3VsdC5jaGFyQXQoaSkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuJHJvb3RTY29wZS4kZW1pdChcImdhbWVBbmFseXplZFwiLCByb20sIGdhbWUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJlYWQgaW4gdGhlIGltYWdlIGZpbGUgYXMgYSBiaW5hcnkgc3RyaW5nLlxuICAgICAgICByZWFkZXIucmVhZEFzQmluYXJ5U3RyaW5nKGdhbWUpO1xuICAgIH1cblxuICAgIGVycm9ySGFuZGxlcihlKSB7XG4gICAgICAgIHN3aXRjaCAoZS50YXJnZXQuZXJyb3IuY29kZSkge1xuICAgICAgICBjYXNlIGUudGFyZ2V0LmVycm9yLk5PVF9GT1VORF9FUlI6XG4gICAgICAgICAgICBhbGVydChcIkZpbGUgTm90IEZvdW5kIVwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGUudGFyZ2V0LmVycm9yLk5PVF9SRUFEQUJMRV9FUlI6XG4gICAgICAgICAgICBhbGVydChcIkZpbGUgaXMgbm90IHJlYWRhYmxlXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgZS50YXJnZXQuZXJyb3IuQUJPUlRfRVJSOlxuICAgICAgICAgICAgYnJlYWs7IC8vIG5vb3BcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGFsZXJ0KFwiQW4gZXJyb3Igb2NjdXJyZWQgcmVhZGluZyB0aGlzIGZpbGUuXCIpO1xuICAgICAgICB9XG4gICAgfVxufSIsIlwidXNlIHN0cmljdFwiO1xuXG5sZXQgc2l6ZSA9IHtcbiAgICB4OiA2NCxcbiAgICB5OiAzMlxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NyZWVuIHtcbiAgICBjb25zdHJ1Y3Rvcigkcm9vdFNjb3BlKSB7XG4gICAgICAgIHRoaXMuJHJvb3RTY29wZSA9ICRyb290U2NvcGU7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5waXhlbHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplLnk7IGkgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5waXhlbHMucHVzaChuZXcgQXJyYXkoc2l6ZS54KS5maWxsKDApKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiRyb290U2NvcGUuJGVtaXQoXCJzY3JlZW5VcGRhdGVkXCIsIHRoaXMucGl4ZWxzKTtcbiAgICB9XG5cbiAgICBkaXNwbGF5U3ByaXRlKHgsIHksIHNwcml0ZSkge1xuICAgICAgICBsZXQgY29sbGlzaW9uID0gZmFsc2U7XG4gICAgICAgIGZvciAobGV0IHJvdyBvZiBzcHJpdGUpIHtcbiAgICAgICAgICAgIGxldCBiaW5hcnkgPSBOdW1iZXIocGFyc2VJbnQocm93LnZhbHVlLCAxNikpLnRvU3RyaW5nKDIpO1xuICAgICAgICAgICAgYmluYXJ5ID0gXCIwMDAwMDAwMFwiLnN1YnN0cihiaW5hcnkubGVuZ3RoKSArIGJpbmFyeTtcbiAgICAgICAgICAgIGNvbGxpc2lvbiA9IHRoaXMuZGlzcGxheVJvdyh4LCB5LCBiaW5hcnkpIHx8IGNvbGxpc2lvbjtcbiAgICAgICAgICAgIHkgKz0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJHJvb3RTY29wZS4kZW1pdChcInNjcmVlblVwZGF0ZWRcIiwgdGhpcy5waXhlbHMpO1xuICAgICAgICByZXR1cm4gY29sbGlzaW9uO1xuICAgIH1cblxuICAgIGRpc3BsYXlSb3coeCwgeSwgcm93KSB7XG4gICAgICAgIGxldCBjb2xsaXNpb24gPSBmYWxzZTtcbiAgICAgICAgZm9yIChsZXQgcGl4ZWwgb2Ygcm93KSB7XG4gICAgICAgICAgICBjb2xsaXNpb24gPSB0aGlzLmRpc3BsYXlQaXhlbCh4LCB5LCBwaXhlbCkgfHwgY29sbGlzaW9uO1xuICAgICAgICAgICAgeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2xsaXNpb247XG4gICAgfVxuXG4gICAgZGlzcGxheVBpeGVsKHgsIHksIHBpeGVsVG9EcmF3KSB7XG4gICAgICAgIHBpeGVsVG9EcmF3ID0gcGFyc2VJbnQocGl4ZWxUb0RyYXcpO1xuXG4gICAgICAgIGxldCBjb2xsaXNpb24gPSB0aGlzLnBpeGVsc1t5ICUgc2l6ZS55XVt4ICUgc2l6ZS54XSAmJiBwaXhlbFRvRHJhdztcbiAgICAgICAgdGhpcy5waXhlbHNbeSAlIHNpemUueV1beCAlIHNpemUueF0gXj0gcGl4ZWxUb0RyYXc7XG5cbiAgICAgICAgcmV0dXJuIGNvbGxpc2lvbjtcbiAgICB9XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNldHRpbmdzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5yZXN0cmljdFNwZWVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5pbnN0cnVjdGlvbnNQZXJTZWNvbmQgPSAxMDA7XG4gICAgICAgIHRoaXMuc291bmQgPSB0cnVlO1xuICAgIH1cbn0iLCJcInVzZSBzdHJpY3RcIjtcblxubGV0IE1PREUgPSB7XG4gICAgSElEREVOOiAwLFxuICAgIFNFVFRJTkdTOiAxLFxuICAgIERFQlVHOiAyXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaWRlUGFuZWwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG5cbiAgICBzZXR0aW5ncygpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IE1PREUuU0VUVElOR1M7XG4gICAgfVxuXG4gICAgZGVidWcoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBNT0RFLkRFQlVHO1xuICAgIH1cblxuICAgIGlzSGlkZGVuKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZSA9PSBNT0RFLkhJRERFTjtcbiAgICB9XG5cbiAgICBpc1Nob3dpbmdTZXR0aW5ncygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUgPT0gTU9ERS5TRVRUSU5HUztcbiAgICB9XG5cbiAgICBpc1Nob3dpbmdEZWJ1ZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUgPT0gTU9ERS5ERUJVRztcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgICB0aGlzLnN0YXRlID0gTU9ERS5ISURERU47XG4gICAgfVxufSIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcGVha2VyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICAgICAgICB0aGlzLmlzUGxheWluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIHN0YXJ0KCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICB0aGlzLmlzUGxheWluZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm9zY2lsbGF0b3IgPSB0aGlzLmNvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuICAgICAgICAgICAgdGhpcy5nYWluID0gdGhpcy5jb250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICAgICAgICAgIHRoaXMub3NjaWxsYXRvci5jb25uZWN0KHRoaXMuZ2Fpbik7XG4gICAgICAgICAgICB0aGlzLmdhaW4uY29ubmVjdCh0aGlzLmNvbnRleHQuZGVzdGluYXRpb24pO1xuICAgICAgICAgICAgdGhpcy5vc2NpbGxhdG9yLnN0YXJ0KDApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RvcCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICB0aGlzLmlzUGxheWluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5nYWluLmdhaW4uZXhwb25lbnRpYWxSYW1wVG9WYWx1ZUF0VGltZShcbiAgICAgICAgICAgICAgICAwLjAwMDAxLCB0aGlzLmNvbnRleHQuY3VycmVudFRpbWUgKyAwLjA0XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufSIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgSGV4IGZyb20gXCIuLy4uL0dlbmVyaWMvSGV4XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YWNrIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zaXplID0gMTY7XG4gICAgICAgIHRoaXMuc3RhY2sgPSB7fTtcbiAgICAgICAgdGhpcy5wb2ludGVyID0gbmV3IEhleChcIjBcIik7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNpemU7IGkgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5zdGFja1tpLnRvU3RyaW5nKDE2KV0gPSBuZXcgSGV4KFwiMFwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBvaW50ZXIgPSBuZXcgSGV4KFwiMFwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0hleH0gaGV4XG4gICAgICovXG4gICAgcHV0KGhleCkge1xuICAgICAgICB0aGlzLnN0YWNrW3RoaXMucG9pbnRlci52YWx1ZV0gPSBoZXg7XG4gICAgICAgIHRoaXMucG9pbnRlci5pbmNyZW1lbnQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7SGV4fVxuICAgICAqL1xuICAgIHJldHJpZXZlKCkge1xuICAgICAgICB0aGlzLnBvaW50ZXIuZGVjcmVtZW50KCk7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YWNrW3RoaXMucG9pbnRlci52YWx1ZV07XG4gICAgfVxufSIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgR2FtZVJ1bm5lckNvbnRyb2xsZXIgZnJvbSBcIi4vQ29udHJvbGxlcnMvR2FtZVJ1bm5lckNvbnRyb2xsZXJcIjtcbmltcG9ydCBTY3JlZW5TZXJ2aWNlIGZyb20gXCIuL1NlcnZpY2VzL1NjcmVlblwiO1xuaW1wb3J0IEtleWJvYXJkU2VydmljZSBmcm9tIFwiLi9TZXJ2aWNlcy9LZXlib2FyZFwiO1xuaW1wb3J0IE1lbW9yeVNlcnZpY2UgZnJvbSBcIi4vU2VydmljZXMvTWVtb3J5XCI7XG5pbXBvcnQgQ3B1U2VydmljZSBmcm9tIFwiLi9TZXJ2aWNlcy9DUFVcIjtcbmltcG9ydCBTdGFja1NlcnZpY2UgZnJvbSBcIi4vU2VydmljZXMvU3RhY2tcIjtcbmltcG9ydCBSZWdpc3RlcnNTZXJ2aWNlIGZyb20gXCIuL1NlcnZpY2VzL1JlZ2lzdGVyc1wiO1xuaW1wb3J0IFJvYW1Mb2FkZXJTZXJ2aWNlIGZyb20gXCIuL1NlcnZpY2VzL1JvYW1Mb2FkZXJcIjtcbmltcG9ydCBTcGVha2VyU2VydmljZSBmcm9tIFwiLi9TZXJ2aWNlcy9TcGVha2VyXCI7XG5pbXBvcnQgU2V0dGluZ3NTZXJ2aWNlIGZyb20gXCIuL1NlcnZpY2VzL1NldHRpbmdzXCI7XG5pbXBvcnQgU2lkZVBhbmVsU2VydmljZSBmcm9tIFwiLi9TZXJ2aWNlcy9TaWRlUGFuZWxcIjtcblxuaW1wb3J0IFNjcmVlbkRpcmVjdGl2ZSBmcm9tIFwiLi9EaXJlY3RpdmVzL1NjcmVlbkRpcmVjdGl2ZVwiO1xuaW1wb3J0IExvYWRSb2FtRGlyZWN0aXZlIGZyb20gXCIuL0RpcmVjdGl2ZXMvQnV0dG9ucy9Mb2FkUm9hbURpcmVjdGl2ZVwiO1xuaW1wb3J0IFNpZGVQYW5lbERpcmVjdGl2ZSBmcm9tIFwiLi9EaXJlY3RpdmVzL1NpZGVQYW5lbFwiO1xuaW1wb3J0IEtleXBhZERpcmVjdGl2ZSBmcm9tIFwiLi9EaXJlY3RpdmVzL0tleXBhZERpcmVjdGl2ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCAoYXBwKSA9PiB7XG4gICAgYXBwLmNvbXBvbmVudChcImdhbWVSdW5uZXJcIiwge1xuICAgICAgICB0ZW1wbGF0ZVVybDogXCJjb21wdXRlci5odG1sXCIsXG4gICAgICAgIGNvbnRyb2xsZXI6IEdhbWVSdW5uZXJDb250cm9sbGVyXG4gICAgfSk7XG5cbiAgICBhcHAuc2VydmljZShcIkNwdVNlcnZpY2VcIiwgQ3B1U2VydmljZSk7XG4gICAgYXBwLnNlcnZpY2UoXCJLZXlib2FyZFNlcnZpY2VcIiwgS2V5Ym9hcmRTZXJ2aWNlKTtcbiAgICBhcHAuc2VydmljZShcIk1lbW9yeVNlcnZpY2VcIiwgTWVtb3J5U2VydmljZSk7XG4gICAgYXBwLnNlcnZpY2UoXCJSZWdpc3RlcnNTZXJ2aWNlXCIsIFJlZ2lzdGVyc1NlcnZpY2UpO1xuICAgIGFwcC5zZXJ2aWNlKFwiU2NyZWVuU2VydmljZVwiLCBTY3JlZW5TZXJ2aWNlKTtcbiAgICBhcHAuc2VydmljZShcIlN0YWNrU2VydmljZVwiLCBTdGFja1NlcnZpY2UpO1xuICAgIGFwcC5zZXJ2aWNlKFwiUm9hbUxvYWRlclNlcnZpY2VcIiwgUm9hbUxvYWRlclNlcnZpY2UpO1xuICAgIGFwcC5zZXJ2aWNlKFwiU3BlYWtlclNlcnZpY2VcIiwgU3BlYWtlclNlcnZpY2UpO1xuICAgIGFwcC5zZXJ2aWNlKFwiU2V0dGluZ3NTZXJ2aWNlXCIsIFNldHRpbmdzU2VydmljZSk7XG4gICAgYXBwLnNlcnZpY2UoXCJTaWRlUGFuZWxTZXJ2aWNlXCIsIFNpZGVQYW5lbFNlcnZpY2UpO1xuXG4gICAgYXBwLmRpcmVjdGl2ZShcInNjcmVlblwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTY3JlZW5EaXJlY3RpdmUoKTtcbiAgICB9KTtcblxuICAgIGFwcC5kaXJlY3RpdmUoXCJzaWRlUGFuZWxcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IFNpZGVQYW5lbERpcmVjdGl2ZSgpO1xuICAgIH0pO1xuXG4gICAgYXBwLmRpcmVjdGl2ZShcImxvYWRSb2FtXCIsIFtcIlJvYW1Mb2FkZXJTZXJ2aWNlXCIsIFwiQ3B1U2VydmljZVwiLCAoUm9hbUxvYWRlclNlcnZpY2UsIENQVSkgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IExvYWRSb2FtRGlyZWN0aXZlKFJvYW1Mb2FkZXJTZXJ2aWNlLCBDUFUpO1xuICAgIH1dKTtcblxuICAgIGFwcC5kaXJlY3RpdmUoXCJrZXlwYWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IEtleXBhZERpcmVjdGl2ZSgpO1xuICAgIH0pO1xufTsiLCJpbXBvcnQgeyBkZWZhdWx0IGFzIGJvb3RzdHJhcENvbXBvbmVudHMgfSBmcm9tIFwiLi9jb21wb25lbnRzXCI7XG5cbmxldCBjaGlwRW11bGF0b3IgPSBhbmd1bGFyLm1vZHVsZShcImNoaXA4RW11bGF0b3JcIiwgW10pO1xuXG5ib290c3RyYXBDb21wb25lbnRzKGNoaXBFbXVsYXRvcik7Il19
