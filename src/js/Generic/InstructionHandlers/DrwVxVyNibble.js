"use strict";

import InstructionHandler from "./InstructionHandler";
import Hex from "./../Hex";

export default class DrwVxVyNibble extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        let sprite = this.cpu.memory.readChunk(opCode.hex(3).toDec(), this.cpu.registerI);
        let x = this.cpu.registers.read(opCode.hex(1)).toDec();
        let y = this.cpu.registers.read(opCode.hex(2)).toDec();
        let collision = this.cpu.screen.displaySprite(x, y, sprite);
        this.cpu.registers.store(new Hex("f"), new Hex((collision ? "1" : "0")));
    }
}

DrwVxVyNibble.instructionRegex = "d...";