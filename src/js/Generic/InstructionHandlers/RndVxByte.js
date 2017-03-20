"use strict";

import InstructionHandler from "./InstructionHandler";
import Hex from "./../Hex";

export default class RndVxByte extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        let vxValue = this.cpu.registers.read(opCode.hex(1, 1));
        let kk = opCode.hex(2, 2);
        let random = Hex.random(new Hex("ff"));
        random.and(kk);
        vxValue.value = random.value;
    }
}

RndVxByte.instructionRegex = "c...";