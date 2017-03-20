"use strict";

import Stack from "Services/Stack";
import Hex from "Generic/Hex";

describe("StackService", () => {
    /**
     * @var {Stack}
     */
    let stack;

    beforeEach(() => {
        stack = new Stack();
    });

    it("put()", () => {
        let hexToPush = new Hex("0abf");
        let positionHex = new Hex("0");
        stack.put(hexToPush);

        expect(stack.pointer.value).toEqual("1");
        expect(stack.stack[positionHex.value]).toEqual(hexToPush);
    });

    it("retrieve()", () => {
        let testHex = new Hex("0bce");
        let positionHex = new Hex("0");
        stack.stack[positionHex.value] = testHex;
        stack.pointer.increment();

        expect(stack.retrieve()).toEqual(testHex);
        expect(stack.pointer.value).toEqual("0");
    });

    it("integrity text", () => {
        stack.put()
    });
});