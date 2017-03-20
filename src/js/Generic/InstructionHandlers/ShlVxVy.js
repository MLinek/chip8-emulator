"use strict";

import InstructionHandler from "./InstructionHandler";
import Hex from "./../Hex";

export default class ShlVxVy extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        let vxValue = this.cpu.registers.read(opCode.hex(1));
        let mostSignificantBit = new Hex(((vxValue.toDec() & 0x80) === 0) ? "0" : "1");
        this.cpu.registers.store(new Hex("f"), mostSignificantBit);

        vxValue.multiplyByTwo(true);
    }
}

ShlVxVy.instructionRegex = "8..e";