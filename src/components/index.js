import { dsDatepicker } from "./dsDatepicker";
import { dsCombobox } from "./dsCombobox";
import { dsNumber, dsNumberConfig } from "./dsNumber";
import { dsFileViewer } from "./dsFileViewer";
import { dsFileUploader } from "./dsFileUploader";
import { dsImageViewer } from "./dsImageViewer";
import { dsPdfViewer, dsPdfViewerComponent } from "./dsPdfViewer";
import { DsNotifyService } from "./dsNotify";
import { dsPaging } from "./dsPaging";
import { dsSidebar } from "./dsSidebar";
import { dsList, dsListItem } from "./dsList";
import { dsPreImageLoader } from "./dsPreImageLoader";
import { dsFocusMeOn } from "./dsFocusMeOn";
import { dsContentLoading } from "./dsContentLoading";
import { dsFullscreenButton } from "./dsFullscreenButton";
import { dsCloseButton } from "./dsCloseButton";
import { dsHtmlCompile } from "./dsHtmlCompile";

export class Index {
    static configure(module) {
        module
            .directive('dsDatepicker', dsDatepicker)
            .directive('dsCombobox', dsCombobox)
            .directive('dsNumber', dsNumber)
            .directive('dsFileViewer', dsFileViewer)
            .directive('dsFileUploader', dsFileUploader)
            .directive('dsImageViewer', dsImageViewer)
            .directive('dsPdfViewerComponent', dsPdfViewerComponent)
            .directive('dsPaging', dsPaging)
            .directive('dsSidebar', dsSidebar)
            .directive('dsList', dsList)
            .directive('dsListItem', dsListItem)
            .directive('dsPreImageLoader', dsPreImageLoader)
            .directive('dsFocusMeOn', dsFocusMeOn)
            .directive('dsContentLoading', dsContentLoading)
            .directive('dsFullscreenButton', dsFullscreenButton)
            .directive('dsCloseButton', dsCloseButton)
            .directive('dsHtmlCompile', dsHtmlCompile)
            .factory('dsPdfViewer', dsPdfViewer)
            .service('dsNotify', DsNotifyService)
            .config(dsNumberConfig)
    }
}

