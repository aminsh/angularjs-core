import { focusMeOn } from "./focusMeOn";
import { contentLoading } from "./contentLoading";
import { fullscreenButton } from "./fullscreenButton";
import { closeButton } from "./closeButton";

export class ComponentsConfiguration {
    static configure(module) {
        module
            .directive('focusMeOn', focusMeOn)
            .directive('dsContentLoading', contentLoading)
            .directive('dsFullscreenButton', fullscreenButton)
            .directive('dsCloseButton', closeButton)
    }
}
