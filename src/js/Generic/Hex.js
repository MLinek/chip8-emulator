"use strict";

export default class Hex {

    /**
     * @param {String} value
     */
    constructor(value) {
        this.setTo(value);
    }

    compare(hex) {
        return this.value == hex.value;
    }

    toDec() {
        return parseInt(this.value, 16);
    }

    increment(isRegister = false) {
        this.add(new Hex("1"), isRegister);
    }

    decrement(isRegister = false) {
        this.subtract(new Hex("1"), isRegister);
    }

    round(nibblesCount) {
        this.value = this.value.slice(-nibblesCount);
    }

    toRegister() {
        let number = this.toDec();
        if (number > 255) {
            number -= 256;
        }
        this.value = number.toString(16);
        // this.value = (this.toDec() & 0xff).toString(16);
    }

    toRegisterI() {
        this.value = (this.toDec() & 0xffff).toString(16);
    }

    /**
     * @param {Hex} hex
     * @param {boolean} isRegister registers must have value between 0 and 255 while some other data may so we need to indicate if current hash
     *                   simulates register
     * @returns {boolean} true if isRegister = true and result > 256 (ff) as some chip8 instructions require action to be taken in that case
     */
    add(hex, isRegister = false) {
        let decimalValue = parseInt(this.value, 16);
        let decimalAddedValue = parseInt(hex.value, 16);
        let result = decimalValue + decimalAddedValue;
        let carry = false;

        if (isRegister) {
            carry = (result & 0xFFFFFF00) !== 0;
            if (result > 255) {
                result -= 256;
            }
            // result &= 0xff;
        }
        this.value = result.toString(16);

        return carry;
    }

    /**
     * @param {Hex} hex
     * @param {boolean} isRegister registers must have value between 0 and 255 while some other data may so we need to indicate if current hash
     *                   simulates register
     * @returns {boolean} true if isRegister = true and result < 0 as some chip8 instructions require action to be taken in that case
     */
    subtract(hex, isRegister = false) {
        let decimalValue = parseInt(this.value, 16);
        let decimalAddedValue = parseInt(hex.value, 16);
        let result = decimalValue - decimalAddedValue;
        let carry = false;

        if (isRegister) {
            carry = decimalValue > decimalAddedValue;
            if (result < 0) {
                result += 256;
            }
            // result &= 0xff;
        }

        this.value = result.toString(16);

        return carry;
    }

    divideByTwo() {
        let result = parseInt(this.value, 16) >> 1;
        this.value = (result).toString(16);
    }

    /**
     * If result is > 255 then 256 will be subtracted to simulate register hex (0x00-0xff) as only
     * registers are multiplied by 2.
     */
    multiplyByTwo(isRegister = false) {
        let result = parseInt(this.value, 16) << 1;
        if (isRegister) {
            if (result > 255) {
                result -= 256;
            }
            // result &= 0xff;
        }
        this.value = (result).toString(16);
    }

    or(hex) {
        let decimalValue = parseInt(this.value, 16);
        let decimalHexValue = parseInt(hex.value, 16);
        this.value = (decimalValue | decimalHexValue).toString(16);
    }

    and(hex) {
        let decimalValue = parseInt(this.value, 16);
        let decimalHexValue = parseInt(hex.value, 16);
        this.value = (decimalValue & decimalHexValue).toString(16);
    }

    xor(hex) {
        let decimalValue = parseInt(this.value, 16);
        let decimalHexValue = parseInt(hex.value, 16);
        this.value = (decimalValue ^ decimalHexValue).toString(16);
    }

    /**
     * Makes it easy to avoid problems when accessing stack or registers memory which can hold
     * up to 16 (0xf) values so there is no unexpected access to non existing cells like 0x01.
     * @returns {string}
     */
    lowestNibble() {
        return this.value.slice(-1);
    }

    /**
     * Some hexes will have 00 value while others 0 which will result in not matching values
     * so this function makes sure values 0x0f and 0xf are seen as equal.
     * @param hex
     * @returns {boolean}
     */
    isEqualTo(hex) {
        return this.realValue() == hex.realValue();
    }

    realValue() {
        let charsToDiscard = 0;
        for (let char of this.value) {
            if (char == "0") {
                charsToDiscard += 1;
            } else {
                break;
            }
        }

        if (charsToDiscard == this.value.length) {
            return "0";
        }

        return this.value.substring(charsToDiscard);
    }

    /**
     * Avoids hard to debug problems when hex is passed as reference which is default JavaScript behaviour.
     * @returns {Hex}
     */
    copy() {
        return new Hex(this.value);
    }

    /**
     * @param {String} value
     */
    setTo(value) {
        this.value = String(value);
    }

    /**
     * This class is convenient place to put random hex in which is required by one of chip8 instructions.
     * @param {Hex} hexMax
     * @returns {Hex}
     */
    static random(hexMax) {
        return new Hex((Math.floor(Math.random() * (hexMax.toDec() + 1))).toString(16));
    }
}