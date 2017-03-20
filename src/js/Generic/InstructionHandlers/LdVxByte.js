"use strict";

import InstructionHandler from "./InstructionHandler";

export default class LdVxByte extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        this.cpu.registers.store(opCode.hex(1), opCode.hex(2, 2));
    }
}

LdVxByte.instructionRegex = "6...";