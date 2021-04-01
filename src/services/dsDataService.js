import { ODataQueryBuilder } from '../utils';

export class DsDataService {
    /* @ngInject */
    constructor(dsPromise, dsHttpRequest, dsEnvironment) {
        this.promise = dsPromise;
        this.httpRequest = dsHttpRequest;
        this.dsEnvironment = dsEnvironment;
    }

    from(collection) {
        const queryBuilder = new ODataQueryBuilder(this.promise, this.httpRequest, this.dsEnvironment);
        queryBuilder.from(collection);
        return queryBuilder;
    }
}
