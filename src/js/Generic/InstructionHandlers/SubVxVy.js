"use strict";

import InstructionHandler from "./InstructionHandler";
import Hex from "./../Hex";

export default class SubVxVy extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        let vxValue = this.cpu.registers.read(opCode.hex(1));
        let vyValue = this.cpu.registers.read(opCode.hex(2));

        let carry = vxValue.subtract(vyValue, true);
        carry = carry ? new Hex("1") : new Hex("0");
        this.cpu.registers.store(new Hex("f"), carry);
    }
}

SubVxVy.instructionRegex = "8..5";