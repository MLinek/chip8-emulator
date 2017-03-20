"use strict";

import InstructionHandler from "./InstructionHandler";
import Hex from "./../Hex";

export default class JpVoAddr extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        let v0Value = this.cpu.registers.read(new Hex("0"));
        this.cpu.pc.jumpTo(opCode.hex(1, 3).add(v0Value));
    }
}

JpVoAddr.instructionRegex = "b...";