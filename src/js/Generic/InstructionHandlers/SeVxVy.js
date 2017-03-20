"use strict";

import InstructionHandler from "./InstructionHandler";

export default class SeVxVy extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        let xRegisterValue = this.cpu.registers.read(opCode.hex(1));
        let yRegisterValue = this.cpu.registers.read(opCode.hex(2));
        if (xRegisterValue.isEqualTo(yRegisterValue)) {
            this.cpu.pc.skipInstruction();
        }
    }
}

SeVxVy.instructionRegex = "5..0";