"use strict";

import Hex from "./Hex";

export default class OpCode extends Hex {
    hex(position, nibblesToRead = 1) {
        return new Hex(this.value.substring(position, position + nibblesToRead));
    }

    static fromMemoryChunk(data) {
        return new OpCode(data[0].value + data[1].value);
    }
}
