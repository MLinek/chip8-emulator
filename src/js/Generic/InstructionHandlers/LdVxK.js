"use strict";

import InstructionHandler from "./InstructionHandler";
import Hex from "./../Hex";

export default class LdVxK extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        this.cpu.wait = true;
        this.cpu.keyboard.onDown((key) => {
            this.buttonDown(opCode, key);
            this.cpu.wait = false;
        });
    }

    /**
     * @param {OpCode} opCode
     * @param {Key} key
     */
    buttonDown(opCode, key) {
        this.cpu.registers.store(opCode.hex(1), new Hex(key.chip8Name));
    }
}

LdVxK.instructionRegex = "f.0a";