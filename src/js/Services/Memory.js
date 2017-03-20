"use strict";

import Hex from "./../Generic/Hex";

export default class Memory {
    constructor() {
        this.reset();
    }

    reset() {
        this.memory = [];
    }

    /**
     * @param bytesToRead
     * @param {Hex} position
     * @returns {Array}
     */
    readChunk(bytesToRead, position) {
        let dataRead = [];
        let currentPosition = position.copy();
        for (let i = 0; i < bytesToRead; i += 1, currentPosition.increment()) {
            dataRead[i] = this.readByte(currentPosition);
        }

        return dataRead;
    }

    /**
     * @param {Hex} position
     * @returns {Hex}
     */
    readByte(position) {
        return this.memory[position.toDec()];
    }

    /**
     * @param bytesToStore
     * @param {Hex} position
     */
    storeChunk(bytesToStore, position) {
        let currentPosition = new Hex(position.value);
        for (let byte of bytesToStore) {
            this.storeByte(byte, currentPosition);
            currentPosition.increment();
        }
    }

    /**
     * @param byte
     * @param {Hex} position
     */
    storeByte(byte, position) {
        if (!(byte instanceof Hex)) {
            byte = new Hex(byte);
        }
        this.memory[position.toDec()] = byte;
    }
}