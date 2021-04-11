import { defaultViewerConfig, addVariable } from "./dsReportTools";
import { Guid } from "../utils";

/* @ngInject */
export function dsReportViewer(dsReportConfig, dsEnvironment, $timeout, dsReportLoader) {
    return {
        restrict: 'E',
        template: '<div id="contentViewer" style="direction: ltr"></div>',
        scope: {
            options: '='
        },
        link: function (scope, element, attrs) {
            dsReportLoader.load().then(init);

            function init() {
                const id = Guid.new();
                const report = new Stimulsoft.Report.StiReport();
                const data = {};

                const config = defaultViewerConfig();
                if (typeof dsReportConfig.viewerConfig === 'function')
                    dsReportConfig.viewerConfig(config);

                const viewer = new Stimulsoft.Viewer.StiViewer(config, "StiViewer" + id, false);

                $(element).find('div').attr('id', id);

                report.loadFile(`${ dsReportConfig.baseURL }/${ scope.options.filename }?token=${ dsEnvironment.TENANT_KEY }`);
                $timeout(() => {
                    viewer.renderHtml(id);
                }, 500);


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
        }
    };
}
