"use strict";

import InstructionHandler from "./InstructionHandler";
import Hex from "./../Hex";

export default class CallAddr extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        let hexToStore = new Hex(this.cpu.pc.value);
        hexToStore.add(new Hex("02"));
        this.cpu.stack.put(hexToStore);
        this.cpu.pc.jumpTo(opCode.hex(1, 3));
    }
}

CallAddr.instructionRegex = "2...";