"use strict";

export default class SidePanel {
    constructor() {
        this.restrict = "A";
        this.templateUrl = "directive/side-panel.html";
        this.replace = true;
        this.scope = false;
    }

    controller($scope, $rootScope) {
    }

    link($scope, element, attrs) {
    }
}
