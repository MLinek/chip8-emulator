"use strict";

import instructionHandlers from "./../Generic/InstructionHandlers/loader";
import Hex from "./../Generic/Hex";
import PC from "./../Generic/PC";
import OpCode from "./../Generic/OpCode";

/**
 * @property {Stack} stack
 * @property {PC} pc
 * @property {Memory} memory
 * @property {Registers} registers
 * @property {Keyboard} keyboard
 * @property {Screen} screen
 */
export default class CPU {

    /**
     *
     * @param {Memory} MemoryService
     * @param {Stack} StackService
     * @param {Registers} RegistersService
     * @param {Keyboard} KeyboardService
     * @param {Screen} ScreenService
     * @param {Speaker} SpeakerService
     * @param {Settings} SettingsService
     */
    constructor(MemoryService, StackService, RegistersService, KeyboardService, ScreenService, SpeakerService, SettingsService) {
        this.keyboard = KeyboardService;
        this.memory = MemoryService;
        this.stack = StackService;
        this.registers = RegistersService;
        this.screen = ScreenService;
        this.speaker = SpeakerService;
        this.settings = SettingsService;
        this.reset();
    }

    nextInstruction() {
        if (this.wait) {
            return true;
        }
        this.executing = true;
        if (this.pc.jumpedFlag()) {
            this.pc.resetJumpedFlag();
        } else {
            this.pc.nextInstruction();
        }
        this.opCode = OpCode.fromMemoryChunk(this.memory.readChunk(2, this.pc));
        let instructionHandler = this.findInstructionHandler(this.opCode);
        if (instructionHandler !== false) {
            (new instructionHandler(this)).execute(this.opCode);
            this.nextOpCode = this.readNextOpCode();
        } else {
            return false;
        }
        return true;
    }

    readNextOpCode() {
        let copy = this.pc.copy();
        if (!this.pc.jumpedFlag()) {
            copy.add(new Hex("02"));
        }
        return OpCode.fromMemoryChunk(this.memory.readChunk(2, copy));
    }

    animationFrame() {
        if (this.delayTimer.toDec() > 0) {
            this.delayTimer.decrement();
        }
        if (this.soundTimer.toDec() > 0) {
            if (this.settings.sound) {
                this.speaker.start();
            }
            this.soundTimer.decrement();
        } else {
            this.speaker.stop();
        }
    }

    /**
     * @param {OpCode} opCode
     * @return {InstructionHandler|Boolean}
     */
    findInstructionHandler(opCode) {
        for (let handler of instructionHandlers) {
            if (opCode.value.match(handler.instructionRegex)) {
                return handler;
            }
        }
        return false;
    }

    /**
     * Resets CPU to initial state
     */
    reset() {
        this.softReset();
        this.memory.reset();
    }

    /**
     * Resets CPU to initial state without clearing memory
     */
    softReset() {
        this.executing = false;
        this.registerI = new Hex("0");
        this.pc = new PC("0");
        this.delayTimer = new Hex("0");
        this.soundTimer = new Hex("0");
        this.wait = false;

        this.stack.reset();
        this.registers.reset();
        this.screen.clear();
    }
}