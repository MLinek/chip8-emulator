"use strict";

import InstructionHandler from "./InstructionHandler";
import Hex from "./../Hex";

export default class ShrVxVy extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        let vxValue = this.cpu.registers.read(opCode.hex(1));
        this.cpu.registers.store(new Hex("f"), new Hex((vxValue.toDec() & 0x01).toString(16)));

        vxValue.divideByTwo(true);
    }
}

ShrVxVy.instructionRegex = "8..6";