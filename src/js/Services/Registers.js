"use strict";

import Hex from "./../Generic/Hex";

export default class Registers {
    constructor() {
        this.size = 16;
        this.registers = {};
        this.reset();
    }

    reset() {
        for (let i = 0; i < this.size; i += 1) {
            this.registers[i.toString(16)] = new Hex("0");
        }
    }

    /**
     *
     * @param {Hex} position
     * @returns {Hex}
     */
    read(position) {
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
    store(position, value) {
        let copy = value.copy();
        copy.value = (parseInt(copy.value, 16) & 0xff).toString(16);
        this.registers[position.lowestNibble()] = copy;
    }
}