"use strict";

import InstructionHandler from "./InstructionHandler";
import Hex from "./../Hex";

export default class AddIVx extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        this.cpu.registerI.add(this.cpu.registers.read(opCode.hex(1, 1)).copy());
    }
}

AddIVx.instructionRegex = "f.1e";