"use strict";

import KeyboardMap from "./../Generic/Keyboard/Map";

export default class Keyboard {
    constructor() {
        this.map = new KeyboardMap();
        this.registerKeyDownEvents();
        this.registerKeyUpEvents();
        this.watcher = false;
    }

    registerKeyDownEvents() {
        document.addEventListener("keydown", (event) => {
            const keyName = event.key;

            if (this.map.keyDown(keyName) && this.watcher) {
                this.watcher(this.map.keyByKeyboardName(keyName));
                this.watcher = false;
            }
        }, false);
    }

    registerKeyUpEvents() {
        document.addEventListener("keyup", (event) => {
            const keyName = event.key;
            this.map.keyUp(keyName);
        }, false);
    }

    isDown(chip8KeyName) {
        return this.map.isDown(chip8KeyName);
    }

    isUp(chip8KeyName) {
        return this.map.isUp(chip8KeyName);
    }

    onDown(callable) {
        this.watcher = callable;
    }
}