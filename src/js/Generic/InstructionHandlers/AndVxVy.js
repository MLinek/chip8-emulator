"use strict";

import InstructionHandler from "./InstructionHandler";

export default class AndVxVy extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        let vxValue = this.cpu.registers.read(opCode.hex(1));
        let vyValue = this.cpu.registers.read(opCode.hex(2));
        vxValue.and(vyValue);
    }
}

AndVxVy.instructionRegex = "8..2";