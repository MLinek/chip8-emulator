"use strict";

import GameRunnerController from "./Controllers/GameRunnerController";
import ScreenService from "./Services/Screen";
import KeyboardService from "./Services/Keyboard";
import MemoryService from "./Services/Memory";
import CpuService from "./Services/CPU";
import StackService from "./Services/Stack";
import RegistersService from "./Services/Registers";
import RoamLoaderService from "./Services/RoamLoader";
import SpeakerService from "./Services/Speaker";
import SettingsService from "./Services/Settings";
import SidePanelService from "./Services/SidePanel";

import ScreenDirective from "./Directives/ScreenDirective";
import LoadRoamDirective from "./Directives/Buttons/LoadRoamDirective";
import SidePanelDirective from "./Directives/SidePanel";
import KeypadDirective from "./Directives/KeypadDirective";

export default (app) => {
    app.component("gameRunner", {
        templateUrl: "computer.html",
        controller: GameRunnerController
    });

    app.service("CpuService", CpuService);
    app.service("KeyboardService", KeyboardService);
    app.service("MemoryService", MemoryService);
    app.service("RegistersService", RegistersService);
    app.service("ScreenService", ScreenService);
    app.service("StackService", StackService);
    app.service("RoamLoaderService", RoamLoaderService);
    app.service("SpeakerService", SpeakerService);
    app.service("SettingsService", SettingsService);
    app.service("SidePanelService", SidePanelService);

    app.directive("screen", function() {
        return new ScreenDirective();
    });

    app.directive("sidePanel", function () {
        return new SidePanelDirective();
    });

    app.directive("loadRoam", ["RoamLoaderService", "CpuService", (RoamLoaderService, CPU) => {
        return new LoadRoamDirective(RoamLoaderService, CPU);
    }]);

    app.directive("keypad", function () {
        return new KeypadDirective();
    });
};