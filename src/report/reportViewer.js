import { defaultViewerConfig, addVariable } from "./reportTools";
import { Guid } from "../utils";

/* @ngInject */
export function reportViewer(dsReportConfig, environment) {
    return {
        restrict: 'E',
        template: '<div id="contentViewer" style="direction: ltr"></div>',
        scope: {
            options: '='
        },
        link: function (scope, element, attrs) {
            const id = Guid.new();
            const report = new Stimulsoft.Report.StiReport();
            const data = {};

            const config = defaultViewerConfig();
            if (typeof dsReportConfig.viewerConfig === 'function')
                dsReportConfig.viewerConfig(config);

            const viewer = new Stimulsoft.Viewer.StiViewer(config, "StiViewer" + id, false);

            $(element).find('div').attr('id', id);

            report.loadFile(`${ dsReportConfig.baseURL }/${ scope.options.filename }?token=${ environment.TENANT_KEY }`);
            viewer.renderHtml(id);

            dsReportConfig.variables.forEach(variable => {
                report.dictionary.variables.add(addVariable(variable));
            });

            const reportVariables = scope[scope.options.variables] || [];

            reportVariables.forEach(variable => {
                report.dictionary.variables.add(addVariable(variable));
            });

            data['data'] = scope.options.data;

            report.regData("data", "data", data);
            viewer.report = report;
        }
    };
}