"use strict";

import PC from "Generic/PC";
import Hex from "Generic/Hex";

describe("PC", () => {
    // @var {PC} pc
    let pc;

    beforeEach(() => {
        pc = new PC("12f");
    });

    it("nextInstruction()", () => {
        pc.nextInstruction();
        expect(pc.value).toEqual("131");
    });

    it("skipInstruction()", () => {
        pc.skipInstruction();
        expect(pc.value).toEqual("133");
    });

    describe("jumping to location", () => {
        beforeEach(() => {
            pc.jumpTo(new Hex("abc"));
        });

        it("jumpTo()", () => {
            expect(pc.value).toEqual("abc");
        });

        it("resetJumpedFlag()", () => {
            expect(pc.jumpedFlag()).toEqual(true);
            pc.resetJumpedFlag();
            expect(pc.jumpedFlag()).toEqual(false);
        });
    });
});