export class DsPromise {
    /* @ngInject */
    constructor($q) {
        this.$q = $q;
    }

    create(handler) {
        let deferred = this.$q.defer();
        handler(deferred.resolve, deferred.reject);
        return deferred.promise;
    }

    all(promises) {
        let deferred = this.$q.defer();

        this.$q.all(promises)
            .then(result => deferred.resolve(result))
            .catch(err => deferred.reject(err));

        return deferred.promise;
    }

    resolve(promiseOrValue) {
        return this.$q.resolve(promiseOrValue);
    }
}
