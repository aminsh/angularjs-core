export class ReportDialog {
    /* @ngInject */
    constructor(data, reportLoader) {
        this.reportReady = false;
        this.options = {
            title: data.title,
            data: data.data,
            filename: data.filename,
            variables: data.variables
        };

        reportLoader.load()
            .then(() => {
                this.reportReady = true;
            });
    }
}
