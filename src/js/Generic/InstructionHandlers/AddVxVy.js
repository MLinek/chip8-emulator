"use strict";

import InstructionHandler from "./InstructionHandler";
import Hex from "./../Hex";

export default class AddVxVy extends InstructionHandler {

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        let vxValue = this.cpu.registers.read(opCode.hex(1));
        let vyValue = this.cpu.registers.read(opCode.hex(2));
        let carry = vxValue.add(vyValue, true);

        carry = carry == true ? new Hex("1") : new Hex("0");
        this.cpu.registers.store(new Hex("f"), carry);
    }
}

AddVxVy.instructionRegex = "8..4";