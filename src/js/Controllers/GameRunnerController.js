import Hex from "./../Generic/Hex";

let sprites = {
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
    f: ["F0", "80", "F0", "80", "80"],
};

let startingTitle = "Drop or click load roam to load game";

/**
 * @property {CPU} cpu
 */
export default class GameRunnerController {
    constructor($scope, $rootScope, $timeout, CpuService, SettingsService, SidePanelService) {
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
        this.$scope.reset = () => {
            this.reset();
        };
        this.$scope.softReset = () => {
            this.softReset();
        };
        this.$scope.debug = () => {
            this.debug();
        };

        $rootScope.$on("gameAnalyzed", (e, rom, gameFile) => {
            this.currentGame = gameFile;
            this.storeHexadecimalSpritesInRom(rom);
            this.cpu.memory.storeChunk(rom, new Hex("0"));
            this.start(rom);
        });
        this.animationFrame();
    }

    start() {
        this.$scope.title = "[Running] " + this.currentGame.name;
        this.cpu.pc.jumpTo(new Hex("200"));

        this.$scope.keepRunning = true;
        this.$scope.started = true;
        this.$scope.nextStep = () => {
            this.cpu.nextInstruction();
        };
        this.$scope.run = () => {
            this.run();
        };
        this.run();
    }

    run() {
        if (this.isRunning()) {
            if (!this.isPaused()) {
                let time = (new Date()).getTime();
                if (!this.settings.restrictSpeed || time - this.lastFrameTime > 1000 / this.settings.instructionsPerSecond) {
                    this.lastFrameTime = time;
                    if (!this.cpu.nextInstruction()) {
                        this.error();
                        return;
                    }
                }
            }

            setImmediate(() => {
                this.run();
            });
        }
    }

    animationFrame() {
        this.$scope.$evalAsync(() => {
            window.requestAnimationFrame(() => {
                if (this.isRunning()) {
                    this.cpu.animationFrame();
                }
                this.animationFrame();
            });
        });
    }

    pause() {
        if (this.isRunning()) {
            this.title = "[Paused] " + this.currentGame.name;
            this.$scope.pause = true;
        }
    }

    stop() {
        this.$scope.keepRunning = false;
    }

    readSprite(start, size) {
        let i, sprite = [], end;
        end = start + parseInt(size, 16);
        for (i = start; i < end; i += 1) {
            let binary = Number(parseInt(this.gameData.rom[i], 16)).toString(2);
            sprite.push("00000000".substr(binary.length) + binary);
        }
        return sprite;
    }

    storeHexadecimalSpritesInRom(rom) {
        let i = 0;
        for (let spriteName of Object.keys(sprites)) {
            for (let byte of sprites[spriteName]) {
                rom[i] = byte;
                i += 1;
            }
        }
    }

    setRegister(register, value) {
        if (value.length == 1) {
            value = "0" + value;
        }
        this.gameData.registers["v" + register] = value;
    }

    getRegister(register) {
        return this.gameData.registers["v" + register];
    }

    reset() {
        this.$scope.title = startingTitle;
        this.stop();
        this.cpu.reset();
        this.currentGame = null;
    }

    softReset() {
        if (this.isRunning()) {
            this.stop();
            this.cpu.softReset();
            this.start();
        }
    }

    error() {
        this.$scope.title = "Error occurred, emulation stopped";
        this.$scope.keepRunning = false;
    }

    isRunning() {
        return this.$scope.keepRunning;
    }

    isPaused() {
        return this.$scope.pause;
    }

    debug() {
        if (this.currentGame) {
            this.pause();
            this.$scope.title = "[Debugging] " + this.currentGame.name;
            this.sidePanel.debug();
        }
    }
}