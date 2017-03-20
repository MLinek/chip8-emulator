"use strict";

import InstructionHandler from "./InstructionHandler";
import Hex from "./../Hex";

export default class LdVxVy extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        this.cpu.registers.store(opCode.hex(1), this.cpu.registers.read(opCode.hex(2)).copy());
    }
}

LdVxVy.instructionRegex = "8..0";