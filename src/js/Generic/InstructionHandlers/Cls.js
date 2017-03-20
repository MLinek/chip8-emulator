"use strict";

import InstructionHandler from "./InstructionHandler";

export default class Cls extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        this.cpu.screen.clear();
    }
}

Cls.instructionRegex = "00e0";