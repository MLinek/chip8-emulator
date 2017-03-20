"use strict";

import InstructionHandler from "./InstructionHandler";

export default class JpAddr extends InstructionHandler {
    /**
     *
     * @param {OpCode} opCode
     */
    execute(opCode) {
        this.cpu.pc.jumpTo(opCode.hex(1, 3));
    }
}

JpAddr.instructionRegex = "1...";