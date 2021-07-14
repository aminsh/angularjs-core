import { addVariable } from "./dsReportTools";

class DsReportDesigner {
    /* @ngInject */
    constructor(dsReportLoader, dsReportConfig, dsEnvironment, dsLogger, dsTranslate, dsPrompt, dsReportFileService) {
        this.dsReportLoader = dsReportLoader;
        this.dsReportConfig = dsReportConfig;
        this.dsEnvironment = dsEnvironment;
        this.dsLogger = dsLogger;
        this.dsTranslate = dsTranslate;
        this.dsPrompt = dsPrompt;
        this.dsReportFileService = dsReportFileService;
        this.options = null;
        this.designer = null;
        this.designerReady = false;
        this.isLoading = false;
    }

    $onInit() {
        this.isLoading = true;

        this.dsReportLoader.loadDesigner()
            .then(() => {
                this.init();
                this.designerReady = true;

            })
            .finally(() => this.isLoading = true);
    }

    init() {
        const report = new Stimulsoft.Report.StiReport();
        this.designer = new Stimulsoft.Designer.StiDesigner(null, 'StiDesigner', false);

        if (this.options.filename)
            report.loadFile(`${ this.dsReportConfig.baseURL }/${ this.options.filename }?token=${ this.dsEnvironment.TENANT_KEY }`);

        this.designer.renderHtml("contentDesigner");

        this.designer.onSaveReport = e => {
            e.preventDefault = true;

            let jsonReport = e.report.saveToJsonString();

            this.dsPrompt({
                title: this.dsTranslate('description'),
                text: this.dsTranslate('description_about_changes'),
            }).then(inputValue => {
                this.dsReportFileService.save({
                    fileName: this.options.filename,
                    data: jsonReport,
                    description: inputValue
                })
                    .then(() => this.dsLogger.success())
                    .catch(e => this.dsLogger.error(e.join('</br>')));
            });
        };

        this.dsReportConfig.variables.forEach(variable => {
            report.dictionary.variables.add(addVariable(variable));
        });

        const reportVariables = this.options.variables || [];

        reportVariables.forEach(variable => {
            report.dictionary.variables.add(addVariable(variable));
        });

        if (report.dictionary.dataSources.items.length > 0)
            report.dictionary.dataSources.items[0].columns.list.forEach(a => a.alias = this.dsTranslate(a.alias));

        const data = {};
        data['data'] = this.options.data;
        report.regData("data", "data", data);
        report.dictionary.synchronize();
        this.designer.report = report;
    }
}

export const dsReportDesignerComponent = {
    controller: DsReportDesigner,
    controllerAs: '$ctrl',
    template: `
        <div ds-content-loading="$ctrl.isLoading" style="min-height: 500px">
            <div id="contentDesigner" ng-if="$ctrl.designerReady" style="direction: ltr"></div> 
       </div>
    `,
    bindings: {
        options: '='
    }
}
