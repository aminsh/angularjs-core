import { BadRequestException, ForbiddenException, NotFoundException, UnauthorizedException } from "../utils";

export class HttpRequest {
    /* @ngInject */
    constructor($http, $q, $rootScope, $cookies, promise, translate, environment) {
        this.$http = $http;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.$cookies = $cookies;
        this.promise = promise;
        this.translate = translate;
        this.environment = environment;
        this.defaultHeaders = {
            "Cache-Control": "no-cache"
        };
        this.defaultQuery = {}
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
        const params = { ...options.query, ...data };
        const headers = { ...this.defaultHeaders, ...options.headers };

        return this.promise.create((resolve, reject) => {
            this.$http.get(url, { params, paramSerializer: '$httpParamSerializerJQLike', headers })
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
        return this.promise.create((resolve, reject) => {
            this.$http.post(url, data, { headers: options.headers, params: options.query })
                .then(result => resolve(result.data))
                .catch(error => this.errorHandler(error, reject));
        });
    }

    put(url, data, options) {
        options = options || {};
        return this.promise.create((resolve, reject) => {
            this.$http.put(url, data, { headers: options.headers, params: options.query })
                .then(result => resolve(result.data))
                .catch(error => this.errorHandler(error, reject));
        });
    }

    delete(url, options) {
        options = options || {};
        return this.promise.create((resolve, reject) => {
            this.$http.delete(url, { headers: options.headers, params: options.query })
                .then(result => resolve(result.data))
                .catch(error => this.errorHandler(error, reject));
        });
    }
}
