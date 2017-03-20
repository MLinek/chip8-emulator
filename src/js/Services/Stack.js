"use strict";

import Hex from "./../Generic/Hex";

export default class Stack {
    constructor() {
        this.size = 16;
        this.stack = {};
        this.pointer = new Hex("0");
        this.reset();
    }

    reset() {
        for (let i = 0; i < this.size; i += 1) {
            this.stack[i.toString(16)] = new Hex("0");
        }
        this.pointer = new Hex("0");
    }

    /**
     * @param {Hex} hex
     */
    put(hex) {
        this.stack[this.pointer.value] = hex;
        this.pointer.increment();
    }

    /**
     * @returns {Hex}
     */
    retrieve() {
        this.pointer.decrement();
        return this.stack[this.pointer.value];
    }
}