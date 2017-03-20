"use strict";

export default class InstructionHandler {

    /**
     * @param {CPU} CpuService
     */
    constructor(CpuService) {
        this.cpu = CpuService;
    }

    /**
     * @param {OpCode} opCode
     */
    execute(opCode) {
        throw new Error("Not yet implemented.");
    }
}