export class DsReportFileService {
    /* @ngInject */
    constructor(dsHttpRequest, devConstants, dsReportConfig) {
        this.dsHttpRequest = dsHttpRequest;
        this.baseUrl = dsReportConfig.baseUrl;
    }

    save(data) {
        return this.dsHttpRequest.post(this.baseUrl, data)
    }

    getHistory(name) {
        return this.dsHttpRequest.get(`${ this.baseUrl }/${ name }/history`);
    }

    returnToDefault(name) {
        return this.dsHttpRequest.put(`${ this.baseUrl }/${ name }/return-to-default`);
    }

    setAsCurrent(name, id) {
        return this.dsHttpRequest.put(`${ this.baseUrl }/${ name }/history/${ id }/set-as-current`);
    }
}
