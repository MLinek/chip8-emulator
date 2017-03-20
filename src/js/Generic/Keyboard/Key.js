"use strict";

let STATE = {
    UP: 0,
    DOWN: 1
};

export default class Key {
    constructor(chip8Name, keyboardName) {
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
    isKeyMapped(keyboardKeyName) {
        return this.keyboardName == keyboardKeyName;
    }

    down() {
        this.state = STATE.DOWN;
    }

    up() {
        this.state = STATE.UP;
    }

    isUp() {
        return this.state == STATE.UP;
    }

    isDown() {
        return this.state == STATE.DOWN;
    }
}