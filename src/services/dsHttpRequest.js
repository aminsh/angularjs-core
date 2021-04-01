import { BadRequestException, ForbiddenException, NotFoundException, UnauthorizedException } from "../utils";

export class DsHttpRequest {
    /* @ngInject */
    constructor($http, $q, $rootScope, $cookies, dsPromise, dsEnvironment) {
        this.$http = $http;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.$cookies = $cookies;
        this.dsPromise = dsPromise;
        this.dsEnvironment = dsEnvironment;
    }

    getDefaultHeaders(options) {
        const headers = {
                "Cache-Control": "no-cache",
                "x-access-token": this.dsEnvironment.TENANT_KEY
            },
            useDefault = options.hasOwnProperty('useDefault') ? options.useDefault : true;
        return useDefault
            ? { ...headers, ...options.headers }
            : options.headers;
    }

    getDefaultQuery(options) {
        const query = {
                fiscalPeriodId: this.dsEnvironment.FISCAL_PERIOD
            },
            useDefault = options.hasOwnProperty('useDefault') ? options.useDefault : true;
        return useDefault
            ? { ...query, ...options.query }
            : options.query;
    }

    errorHandler(error, reject) {
        let exception;
        switch (error.status) {
            case 400:
                exception = new BadRequestException(error.data, error);
                break;
            case 401:
                exception = new UnauthorizedException(error);
                break;
            case 403:
                exception = new ForbiddenException(error);
                break;
            case 404:
                exception = new NotFoundException(error);
                break;
            default:
                exception = new Error(error);
                break;
        }

        reject(exception);
        this.$rootScope.$emit('error', exception);
    }

    get(url, data, options) {
        options = options || {};
        const params = { ...this.getDefaultQuery(options), ...data };
        return this.dsPromise.create((resolve, reject) => {
            this.$http.get(url, {
                params,
                paramSerializer: '$httpParamSerializerJQLike',
                headers: this.getDefaultHeaders(options)
            })
                .then(result => {
                    resolve(result.data);
                })
                .catch(error => {
                    this.errorHandler(error, reject);
                });
        });
    }

    post(url, data, options) {
        options = options || {};
        return this.dsPromise.create((resolve, reject) => {
            this.$http.post(url, data, {
                headers: this.getDefaultHeaders(options),
                params: this.getDefaultQuery(options)
            })
                .then(result => resolve(result.data))
                .catch(error => this.errorHandler(error, reject));
        });
    }

    put(url, data, options) {
        options = options || {};
        return this.dsPromise.create((resolve, reject) => {
            this.$http.put(url, data, {
                headers: this.getDefaultHeaders(options),
                params: this.getDefaultQuery(options)
            })
                .then(result => resolve(result.data))
                .catch(error => this.errorHandler(error, reject));
        });
    }

    delete(url, options) {
        options = options || {};
        return this.dsPromise.create((resolve, reject) => {
            this.$http.delete(url, { headers: this.getDefaultHeaders(options), params: this.getDefaultQuery(options) })
                .then(result => resolve(result.data))
                .catch(error => this.errorHandler(error, reject));
        });
    }
}
