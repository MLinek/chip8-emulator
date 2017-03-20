"use strict";

import Key from "./Key";

let keysSet = new Set(
    [
        new Key("1", "1"), new Key("2", "2"), new Key("3", "3"), new Key("c", "4"),
        new Key("4", "q"), new Key("5", "w"), new Key("6", "e"), new Key("d", "r"),
        new Key("7", "a"), new Key("8", "s"), new Key("9", "d"), new Key("e", "f"),
        new Key("a", "z"), new Key("0", "x"), new Key("b", "c"), new Key("f", "v")
    ]
);

export { keysSet };

export default class Map {
    keyDown(keyboardKeyName) {
        let keyObject = this.keyByKeyboardName(keyboardKeyName);
        if (keyObject !== false) {
            keyObject.down();
        }
        return keyObject;
    }

    keyUp(keyboardKeyName) {
        let keyObject = this.keyByKeyboardName(keyboardKeyName);
        if (keyObject !== false) {
            keyObject.up();
        }
        return keyObject;
    }

    isDown(chip8Name) {
        let keyObject = this.keyByChip8Name(chip8Name);
        if (keyObject !== false) {
            return keyObject.isDown();
        }
        return false;
    }

    isUp(chip8Name) {
        let keyObject = this.keyByChip8Name(chip8Name);
        if (keyObject !== false) {
            return keyObject.isUp();
        }
        return false;
    }

    keyByKeyboardName(keyboardKeyName) {

        for (let key of keysSet) {
            if (key.isKeyMapped(keyboardKeyName)) {
                return key;
            }
        }
        return false;
    }

    keyByChip8Name(name) {
        for (let key of keysSet) {
            if (key.chip8Name == name) {
                return key;
            }
        }
    }
}