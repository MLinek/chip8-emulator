"use strict";

import Hex from "./Hex";

export default class PC extends Hex {
    constructor(value) {
        super(value);

        this.jumped = false;
    }

    nextInstruction() {
        this.add(new Hex("02"));
    }

    skipInstruction() {
        this.add(new Hex("04"));
        this.jumped = true;
    }

    /**
     * @param {Hex} hex
     */
    jumpTo(hex) {
        this.value = hex.value;
        this.jumped = true;
    }

    jumpedFlag() {
        return this.jumped;
    }

    resetJumpedFlag() {
        this.jumped = false;
    }
}
