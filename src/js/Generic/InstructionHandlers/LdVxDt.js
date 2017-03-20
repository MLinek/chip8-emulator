"use strict";

import InstructionHandler from "./InstructionHandler";

export default class LdVxDt extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        this.cpu.registers.store(opCode.hex(1), this.cpu.delayTimer.copy());
    }
}

LdVxDt.instructionRegex = "f.07";