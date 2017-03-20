"use strict";

import InstructionHandler from "./InstructionHandler";
import Hex from "./../Hex";

export default class LdVxI extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        let decimalX = opCode.hex(1).toDec();
        let registerICopy = this.cpu.registerI.copy();

        for (let i = 0; i <= decimalX; i += 1) {
            let memoryCopy = this.cpu.memory.readByte(registerICopy).copy();
            memoryCopy.toRegister();
            this.cpu.registers.store(new Hex(i.toString(16)), memoryCopy);
            registerICopy.increment();
        }
    }
}

LdVxI.instructionRegex = "f.65";