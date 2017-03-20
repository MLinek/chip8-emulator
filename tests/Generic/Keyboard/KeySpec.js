"use strict";

import Key from "Generic/Keyboard/Key";

describe("Key", () => {
    /**
     * @type {Key}
     */
    let key;
    let keyboardName = "a",
        chip8Name = "b";

    beforeEach(() => {
        key = new Key(chip8Name, keyboardName);
    });

    it("isKeyMapped()", () => {
        expect(key.isKeyMapped("1")).toEqual(false);
        expect(key.isKeyMapped(chip8Name)).toEqual(false);
        expect(key.isKeyMapped(keyboardName)).toEqual(true);
    });

    describe("press tests", () => {
        it("down()", () => {
            expect(key.isDown()).toEqual(false);
            key.down();
            expect(key.isDown()).toEqual(true);
        });

        it("up()", () => {
            expect(key.isUp()).toEqual(true);
            key.down();
            expect(key.isUp()).toEqual(false);
            key.up();
            expect(key.isUp()).toEqual(true);
        });
    });
});