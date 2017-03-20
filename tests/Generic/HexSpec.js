"use strict";

import Hex from "Generic/Hex";

describe("Hex tests", () => {
    let hex;

    beforeEach(() => {
        hex = new Hex("f0");
    });

    it("constructor()", () => {
        expect(hex.value).toEqual("f0");
    });

    it("toDec()", () => {
        let hex = new Hex("f0");
        expect(hex.toDec()).toEqual(240);
    });

    it("increment()", () => {
        hex.increment();
        expect(hex.value).toEqual("f1");

        hex.value = "ff";
        hex.increment();
        expect(hex.value).toEqual("100");

        hex.value = "ff";
        hex.increment(true);
        expect(hex.value).toEqual("0");
    });

    it("decrement()", () => {
        hex.decrement();
        expect(hex.value).toEqual("ef");

        hex.value = "00";
        hex.decrement();
        expect(hex.value).toEqual("-1");

        hex.value = "00";
        hex.decrement(true);
        expect(hex.value).toEqual("ff");
    });

    it("add()", () => {
        expect(hex.add(new Hex("f"), true)).toEqual(false);
        expect(hex.value).toEqual("ff");

        expect(hex.add(new Hex("01"), true)).toEqual(true);
        expect(hex.value).toEqual("0");

        hex.add(new Hex("abd"));
        expect(hex.value).toEqual("abd");
    });

    it("subtract()", () => {
        expect(hex.subtract(new Hex("1"), true)).toEqual(true);
        expect(hex.value).toEqual("ef");

        expect(hex.subtract(new Hex("f0"), true)).toEqual(false);
        expect(hex.value).toEqual("ff");
    });

    it("divideByTwo()", () => {
        hex.divideByTwo();
        expect(hex.value).toEqual("78");
    });

    it("multiplyByTwo()", () => {
        hex.multiplyByTwo();
        expect(hex.value).toEqual("1e0");

        hex.value = "0f";
        hex.multiplyByTwo();
        expect(hex.value).toEqual("1e");
    });

    it("or()", () => {
        hex.or(new Hex("ab"));
        expect(hex.value).toEqual("fb");
    });

    it("and()", () => {
        hex.and(new Hex("ab"));
        expect(hex.value).toEqual("a0");
    });

    it("xor()", () => {
        hex.xor(new Hex("ab"));
        expect(hex.value).toEqual("5b");
    });

    it("lowestNibble()", () => {
        hex.value = "00ff00a";
        expect(hex.lowestNibble()).toEqual("a");
    });

    it("isEqualTo", () => {
        hex.value = "f0";
        expect(hex.isEqualTo(new Hex("f0"))).toEqual(true);

        hex.value = "000";
        expect(hex.isEqualTo(new Hex("a"))).toEqual(false);

        hex.value = "0000";
        expect(hex.isEqualTo(new Hex("0"))).toEqual(true);

        hex.value = "000";
        expect(hex.isEqualTo(new Hex("0000"))).toEqual(true);

        hex.value = "0000fa";
        expect(hex.isEqualTo(new Hex("0fa"))).toEqual(true);
    });

    it("realValue", () => {
        hex.value = "0003";
        expect(hex.realValue()).toEqual("3");

        hex.value = "123";
        expect(hex.realValue()).toEqual("123");

        hex.value = "01";
        expect(hex.realValue()).toEqual("1");

        hex.value = "0000000";
        expect(hex.realValue()).toEqual("0");

        hex.value = "0";
        expect(hex.realValue()).toEqual("0");
    });
});