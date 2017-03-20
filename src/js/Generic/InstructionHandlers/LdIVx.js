"use strict";

import InstructionHandler from "./InstructionHandler";
import Hex from "./../Hex";

export default class LdIVx extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        let decimalX = opCode.hex(1).toDec();
        let registerICopy = this.cpu.registerI.copy();

        for (let i = 0; i <= decimalX; i += 1) {
            let registerCopy = this.cpu.registers.read(new Hex(i.toString(16))).copy();
            this.cpu.memory.storeByte(registerCopy, registerICopy);
            // this.cpu.registerI.increment();
            registerICopy.increment();
        }
    }
}

LdIVx.instructionRegex = "f.55";