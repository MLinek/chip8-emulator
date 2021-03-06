"use strict";

import InstructionHandler from "./InstructionHandler";

export default class XorVxVy extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        let vxValue = this.cpu.registers.read(opCode.hex(1));
        let vyValue = this.cpu.registers.read(opCode.hex(2));
        vxValue.xor(vyValue);
    }
}

XorVxVy.instructionRegex = "8..3";