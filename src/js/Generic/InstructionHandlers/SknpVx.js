"use strict";

import InstructionHandler from "./InstructionHandler";

export default class SknpVx extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        if (!this.cpu.keyboard.isDown(this.cpu.registers.read(opCode.hex(1)).realValue())) {
            this.cpu.pc.skipInstruction();
        }
    }
}

SknpVx.instructionRegex = "e.a1";