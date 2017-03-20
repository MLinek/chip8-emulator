"use strict";

import InstructionHandler from "./InstructionHandler";

export default class AddVxByte extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        this.cpu.registers.read(opCode.hex(1, 1)).add(opCode.hex(2, 2), true);
    }
}

AddVxByte.instructionRegex = "7...";