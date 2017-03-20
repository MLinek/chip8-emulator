"use strict";

import Memory from "Services/Memory";
import Hex from "Generic/Hex";

describe("Memory service test", () => {
    let memory;

    beforeEach(() => {
        memory = new Memory();
    });

    it("storeByte()", () => {
        let position = new Hex("f0f");
        let storedByte = new Hex("a0");
        memory.storeByte(storedByte, position);
        expect(memory.memory[position.toDec()].value).toEqual(storedByte.value);
    });

    it("storeChunk()", () => {
        let startPosition = new Hex("f08");
        let storedChunk = [
            new Hex("a0"),
            new Hex("af"),
            new Hex("12"),
            new Hex("34"),
            new Hex("b4")
        ];
        memory.storeChunk(storedChunk, startPosition);
        for (let i = 0; i < storedChunk.length; i += 1, startPosition.increment()) {
            expect(memory.memory[startPosition.toDec()].value).toEqual(storedChunk[i].value);
        }
    });

    it("readByte", () => {
        let position = new Hex("f0f");
        let storedByte = new Hex("a0");
        memory.memory[position.toDec()] = storedByte;
        expect(memory.readByte(position)).toEqual(storedByte);
    });

    it("readChunk", () => {
        let startPosition = new Hex("f08");
        let storedChunk = [
            new Hex("a0"),
            new Hex("af"),
            new Hex("12"),
            new Hex("34"),
            new Hex("b4")
        ];
        for (let i = 0; i < storedChunk.length; i += 1) {
            memory.memory[startPosition.toDec() + i] =  storedChunk[i];
        }
        expect(memory.readChunk(storedChunk.length, startPosition)).toEqual(storedChunk);
    });
});