import { ODataQueryBuilder } from '../utils';

export class DataService {
    /* @ngInject */
    constructor(promise, httpRequest, environment) {
        this.promise = promise;
        this.httpRequest = httpRequest;
        this.environment = environment;
    }

    from(collection) {
        const queryBuilder = new ODataQueryBuilder(this.promise, this.httpRequest, this.environment);
        queryBuilder.from(collection);
        return queryBuilder;
    }
}
