"use strict";

import InstructionHandler from "./InstructionHandler";

export default class SneVxVy extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        let vxValue = this.cpu.registers.read(opCode.hex(1));
        let vyValue = this.cpu.registers.read(opCode.hex(2));
        if (!vxValue.isEqualTo(vyValue)) {
            this.cpu.pc.skipInstruction();
        }
    }
}

SneVxVy.instructionRegex = "9..0";