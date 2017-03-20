"use strict";

export default class KeypadDirective {
    constructor() {
        this.restrict = "A";
        this.templateUrl = "directive/keypad.html";
        this.replace = true;
        this.scope = false;
    }

    controller($scope, $rootScope) {
    }

    link($scope, element, attrs) {
    }
}
