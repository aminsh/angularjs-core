import { dsReportViewer } from "./dsReportViewer";
import { dsReportConfigProvider } from "./dsReportConfigProvider";
import { DsReportDialogController } from "./dsReportDialogController";
import { DsReportLoader } from "./dsReportLoader";
import dsReportDialogTemplate from './dsReportDialog.html';

export class Index {
    static configure(module) {
        module
            .provider('dsReportConfig', dsReportConfigProvider)
            .directive('dsReportViewer', dsReportViewer)
            .factory('dsReportDialog', /*@ngInject*/ (dsDialog) => {
                return dsDialog.createForService({
                    controller: DsReportDialogController,
                    controllerAs: '$ctrl',
                    template: dsReportDialogTemplate
                });
            })
            .service('dsReportLoader', DsReportLoader)
    }
}
