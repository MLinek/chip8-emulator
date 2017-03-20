"use strict";

export default class Speaker {
    constructor() {
        this.context = new AudioContext();
        this.isPlaying = false;
    }

    start() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.oscillator = this.context.createOscillator();
            this.gain = this.context.createGain();
            this.oscillator.connect(this.gain);
            this.gain.connect(this.context.destination);
            this.oscillator.start(0);
        }
    }

    stop() {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.gain.gain.exponentialRampToValueAtTime(
                0.00001, this.context.currentTime + 0.04
            );
        }
    }
}