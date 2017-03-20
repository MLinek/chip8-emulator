"use strict";

let size = {
    x: 64,
    y: 32
};

export default class Screen {
    constructor($rootScope) {
        this.$rootScope = $rootScope;
        this.clear();
    }

    clear() {
        this.pixels = [];
        for (let i = 0; i < size.y; i += 1) {
            this.pixels.push(new Array(size.x).fill(0));
        }
        this.$rootScope.$emit("screenUpdated", this.pixels);
    }

    displaySprite(x, y, sprite) {
        let collision = false;
        for (let row of sprite) {
            let binary = Number(parseInt(row.value, 16)).toString(2);
            binary = "00000000".substr(binary.length) + binary;
            collision = this.displayRow(x, y, binary) || collision;
            y += 1;
        }

        this.$rootScope.$emit("screenUpdated", this.pixels);
        return collision;
    }

    displayRow(x, y, row) {
        let collision = false;
        for (let pixel of row) {
            collision = this.displayPixel(x, y, pixel) || collision;
            x += 1;
        }
        return collision;
    }

    displayPixel(x, y, pixelToDraw) {
        pixelToDraw = parseInt(pixelToDraw);

        let collision = this.pixels[y % size.y][x % size.x] && pixelToDraw;
        this.pixels[y % size.y][x % size.x] ^= pixelToDraw;

        return collision;
    }
}