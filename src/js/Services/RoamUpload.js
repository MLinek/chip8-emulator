"use strict";

import Hex from "./../Generic/Hex";

export default class RoamUpload {
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
        return this.registers[position.lowestNibble()];
    }

    /**
     * @param {Hex} position
     * @param {Hex} value
     */
    store(position, value) {
        this.registers[position.lowestNibble()] = value.copy();
    }
}