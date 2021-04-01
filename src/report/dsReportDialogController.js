export class DsReportDialogController {
    /* @ngInject */
    constructor(data, dsReportLoader) {
        this.reportReady = false;
        this.options = {
            title: data.title,
            data: data.data,
            filename: data.filename,
            variables: data.variables
        };

        dsReportLoader.load()
            .then(() => {
                this.reportReady = true;
            });
    }
}
