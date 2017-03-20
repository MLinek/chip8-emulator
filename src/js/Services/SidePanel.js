"use strict";

let MODE = {
    HIDDEN: 0,
    SETTINGS: 1,
    DEBUG: 2
};

export default class SidePanel {
    constructor() {
        this.hide();
    }

    settings() {
        this.state = MODE.SETTINGS;
    }

    debug() {
        this.state = MODE.DEBUG;
    }

    isHidden() {
        return this.state == MODE.HIDDEN;
    }

    isShowingSettings() {
        return this.state == MODE.SETTINGS;
    }

    isShowingDebug() {
        return this.state == MODE.DEBUG;
    }

    hide() {
        this.state = MODE.HIDDEN;
    }
}