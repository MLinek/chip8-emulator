"use strict";

import InstructionHandler from "./InstructionHandler";

export default class LdStVx extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        this.cpu.soundTimer = this.cpu.registers.read(opCode.hex(1)).copy();
    }
}

LdStVx.instructionRegex = "f.18";