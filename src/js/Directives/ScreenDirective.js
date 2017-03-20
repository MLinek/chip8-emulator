"use strict";

/**
 * @property {Array<Array<int>>} pixels
 */
export default class ScreenDirective {
    constructor() {
        this.restrict = "E";
        this.templateUrl = "directive/screen.html";
        this.replace = true;
    }

    controller($scope, $rootScope) {
    }

    link($scope, element, attrs) {
        $scope.$root.$on("screenUpdated", (e, pixels) => {
            this.updateScreen(pixels);
        });
        this.canvas = element[0].getElementsByTagName("canvas")[0];
        this.ctx = this.canvas.getContext("2d");
        this.pixelSize = {
            height: this.canvas.clientHeight / 32,
            width: this.canvas.clientWidth / 64
        };
        this.canvas.height = this.canvas.clientHeight;
        this.canvas.width = this.canvas.clientWidth;
    }

    /**
     *
     * @param {Array.<int>} newPixels
     */
    updateScreen(newPixels) {
        if (!this.pixels) {
            this.pixels = [];
            for (let key in newPixels) {
                if (newPixels.hasOwnProperty(key)) {
                    this.pixels[key] = newPixels[key].slice();
                }
            }
            this.paintAll();
        } else {
            this.selectivePaint(newPixels);
        }
    }

    paintAll() {
        let pixelsIterator = this.iteratePixels(),
            pixelData;

        while (pixelData = pixelsIterator.next().value) {
            this.paintPixel(pixelData[0], pixelData[1], pixelData[2]);
        }
    }

    selectivePaint(newPixels) {
        let newPixelValue,
            pixelData,
            pixelsIterator = this.iteratePixels();

        while (pixelData = pixelsIterator.next().value) {
            newPixelValue = newPixels[pixelData[0]][pixelData[1]];
            if (pixelData[2] != newPixelValue) {
                this.paintPixel(pixelData[0], pixelData[1], newPixelValue);
            }
        }
    }

    paintPixel(y, x, pixelValue) {
        this.pixels[y][x] = pixelValue;
        if (pixelValue) {
            this.ctx.fillStyle = "white";
        } else {
            this.ctx.fillStyle = "black";
        }
        this.ctx.fillRect(x * this.pixelSize.width, y * this.pixelSize.height, this.pixelSize.width, this.pixelSize.height);
    }

    *iteratePixels() {
        for (let y in this.pixels) {
            if (this.pixels.hasOwnProperty(y)) {
                for (let x in this.pixels[y]) {
                    if (this.pixels[y].hasOwnProperty(x)) {
                        yield [y, x, this.pixels[y][x]];
                    }
                }
            }
        }
    }
}

ScreenDirective.$inject = ["$rootScope"];