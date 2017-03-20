"use strict";

import InstructionHandler from "./InstructionHandler";

export default class LdDtVx extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        this.cpu.delayTimer = this.cpu.registers.read(opCode.hex(1)).copy();
    }
}

LdDtVx.instructionRegex = "f.15";