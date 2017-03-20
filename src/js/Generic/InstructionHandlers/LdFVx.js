"use strict";

import InstructionHandler from "./InstructionHandler";

export default class LdFVx extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        this.cpu.registerI.value = (parseInt(this.cpu.registers.read(opCode.hex(1)).value, 16) * 5).toString(16);
    }
}

LdFVx.instructionRegex = "f.29";