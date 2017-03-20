"use strict";

import InstructionHandler from "./InstructionHandler";
import Hex from "./../Hex";

export default class LdBVx extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        let numberToStore = this.cpu.registers.read(opCode.hex(1)).toDec();
        let memoryLocation = this.cpu.registerI.copy();

        this.cpu.memory.storeByte(new Hex(Math.floor(numberToStore / 100)), memoryLocation);
        memoryLocation.increment();
        this.cpu.memory.storeByte(new Hex(Math.floor((numberToStore / 10) % 10)), memoryLocation);
        memoryLocation.increment();
        this.cpu.memory.storeByte(new Hex(Math.floor((numberToStore % 100) % 10)), memoryLocation);
    }
}

LdBVx.instructionRegex = "f.33";