"use strict";

import InstructionHandler from "./InstructionHandler";

export default class LdIAddr extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        this.cpu.registerI.value = opCode.hex(1, 3).value;
    }
}

LdIAddr.instructionRegex = "a...";