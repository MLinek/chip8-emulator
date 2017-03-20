"use strict";

import Registers from "Services/Registers";
import Hex from "Generic/Hex";

describe("Registers Service", () => {
    let registers;

    beforeEach(() => {
        registers = new Registers();
    });

    it("read()", () => {
        let registerPosition = new Hex("a");
        let valueToStore = new Hex("fs");
        registers.registers[registerPosition.value] = valueToStore;
        expect(registers.read(registerPosition)).toEqual(valueToStore);
    });

    it("store()", () => {
        let registerPosition = new Hex("a");
        let valueToStore = new Hex("fc");
        registers.store(registerPosition, valueToStore);
        expect(registers.registers[registerPosition.lowestNibble()]).toEqual(valueToStore);
    });

    it("read() and store() work with references", () => {
        let registerPosition = new Hex("a");
        registers.store(registerPosition, new Hex("fc"));

        let retrievedValue = registers.read(registerPosition);
        retrievedValue.add(new Hex("01"));
        expect(registers.read(registerPosition)).toEqual(retrievedValue);
    });
});