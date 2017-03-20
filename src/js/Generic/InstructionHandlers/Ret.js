"use strict";

import InstructionHandler from "./InstructionHandler";
import Hex from "./../Hex";

export default class Ret extends InstructionHandler {
    execute() {
        this.cpu.pc.jumpTo(new Hex(this.cpu.stack.retrieve().value));
    }
}

Ret.instructionRegex = "00ee";