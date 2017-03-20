"use strict";

import InstructionHandler from "./InstructionHandler";

export default class SkpVx extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        if (this.cpu.keyboard.isDown(this.cpu.registers.read(opCode.hex(1)).realValue())) {
            this.cpu.pc.skipInstruction();
        }
    }
}

SkpVx.instructionRegex = "e.9e";