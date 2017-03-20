"use strict";

import Hex from "./../Generic/Hex";

let startingPosition = 512;

export default class RoamLoader {

    constructor($rootScope) {
        this.$rootScope = $rootScope;
    }

    bin2hex(s) {
        //  discuss at: http://phpjs.org/functions/bin2hex/
        // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // bugfixed by: Onno Marsman
        // bugfixed by: Linuxworld
        // improved by: ntoniazzi (http://phpjs.org/functions/bin2hex:361#comment_177616)
        //   example 1: bin2hex('Kev');
        //   returns 1: '4b6576'
        //   example 2: bin2hex(String.fromCharCode(0x00));
        //   returns 2: '00'

        let i, l, o = "",
            n;

        s += "";

        for (i = 0, l = s.length; i < l; i++) {
            n = s.charCodeAt(i)
                .toString(16);
            o += n.length < 2 ? "0" + n : n;
        }

        return o;
    }

    load(game) {
        let rom = [],
            reader = new FileReader();

        reader.onerror = (e) => {
            this.errorHandler(e);
        };

        reader.onprogress = (e) => {
            // this.updateProgress(e);
        };

        reader.onabort = (e) => {
            // alert('File read cancelled');
        };

        reader.onloadstart = (e) => {
            // console.log('loading file');
        };

        reader.onload = (e) => {
            for (let i = 0; i < reader.result.length; i += 1) {
                rom[startingPosition + i] = new Hex(this.bin2hex(reader.result.charAt(i)));
            }
            this.$rootScope.$emit("gameAnalyzed", rom, game);
        };

        // Read in the image file as a binary string.
        reader.readAsBinaryString(game);
    }

    errorHandler(e) {
        switch (e.target.error.code) {
        case e.target.error.NOT_FOUND_ERR:
            alert("File Not Found!");
            break;
        case e.target.error.NOT_READABLE_ERR:
            alert("File is not readable");
            break;
        case e.target.error.ABORT_ERR:
            break; // noop
        default:
            alert("An error occurred reading this file.");
        }
    }
}