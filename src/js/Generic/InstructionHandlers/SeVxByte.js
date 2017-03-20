"use strict";

import InstructionHandler from "./InstructionHandler";

export default class SeVxByte extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        let registerValue = this.cpu.registers.read(opCode.hex(1));
        if (registerValue.isEqualTo(opCode.hex(2, 2))) {
            this.cpu.pc.skipInstruction();
        }
    }
}

SeVxByte.instructionRegex = "3...";