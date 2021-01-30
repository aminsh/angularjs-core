import { reportViewer } from "./reportViewer";
import { reportConfigProvider } from "./reportConfigProvider";
import { ReportDialog } from "./reportDialog";

export class ReportConfiguration {
    static configure(module) {
        module
            .provider('dsReportConfig', reportConfigProvider)
            .directive('dsReportViewer', reportViewer)
            .controller('dsReportDialogController', ReportDialog)
            .factory('dsReportDialog', /*@ngInject*/ (dsDialog) => {
                return dsDialog.createForService({
                    controller: 'dsReportDialogController',
                    controllerAs: '$ctrl',
                    templateUrl: 'dsCore/report/reportDialog.html'
                });
            })
    }
}
