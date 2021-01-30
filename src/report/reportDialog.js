export class ReportDialog {
    /* @ngInject */
    constructor(data) {
        this.options = {
            title: data.title,
            data: data.data,
            filename: data.filename,
            variables: data.variables
        };
    }
}
