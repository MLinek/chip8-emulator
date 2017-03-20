"use strict";

import OpCode from "Generic/OpCode";
import Hex from "Generic/Hex";

describe("OpCode", () => {
    it("hex()", () => {
        let opCode = new OpCode("feab");
        expect(opCode.hex(0).value).toEqual("f");
        expect(opCode.hex(1).value).toEqual("e");
        expect(opCode.hex(0, 2).value).toEqual("fe");
        expect(opCode.hex(0, 10).value).toEqual("feab");
        expect(opCode.hex(1, 2).value).toEqual("ea");
        expect(opCode.hex(1, 12).value).toEqual("eab");
    });

    it("fromMemoryChunk()", () => {
        let memoryChunk = [
            new Hex("12"),
            new Hex("34")
        ];
        let resultOpCode = OpCode.fromMemoryChunk(memoryChunk);

        expect(resultOpCode.value).toEqual("1234");
        expect(resultOpCode).toEqual(jasmine.any(OpCode));
    });
});