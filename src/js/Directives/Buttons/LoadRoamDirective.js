"use strict";

export default class LoadRoamDirective {

    constructor(RoamLoaderService, CPU) {
        this.cpu = CPU;
        this.restrict = "A";
        this.roamLoader = RoamLoaderService;
    }

    link($scope, element, attrs) {
        let button = element[0].getElementsByTagName("button").item(0),
            input = element[0].getElementsByTagName("input").item(0);
        this.registerButtonEvents(button, input);
    }

    registerButtonEvents(button, input) {
        button.addEventListener("click", (e) => {
            input.click();
        });
        input.addEventListener("change", (e) => {
            this.fileSelected(e, e.target.files[0]);
            e.target.value = "";
        });
        button.addEventListener("drop", (e) => {
            this.fileSelected(e, e.dataTransfer.files[0]);
        });
        window.addEventListener("drop", (e) => {
            this.fileSelected(e, e.dataTransfer.files[0]);
        });
        window.addEventListener("dragover", (e) => {
            this.fileDragged(e, e.dataTransfer.files[0]);
        });
    }

    /**
     * Without catching dragOver event drop event won't be catched.
     * @param e
     * @param file
     */
    fileDragged(e, file) {
        e.stopPropagation();
        e.preventDefault();
    }

    fileSelected(e, file) {
        e.stopPropagation();
        e.preventDefault();

        if (file) {
            this.stopCurrentGame();
            this.roamLoader.load(file);
        }
    }

    stopCurrentGame() {
        this.cpu.reset();
    }
}