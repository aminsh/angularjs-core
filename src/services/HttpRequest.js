export class HttpRequest {
    constructor($http, $q, $rootScope, $cookies, promise, translate, environment) {
        this.$http = $http;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.$cookies = $cookies;
        this.promise = promise;
        this.translate = translate;
        this.environment = environment;
    }

    promisify($httpPromise) {
        return this.promise.create((resolve, reject) => {
            $httpPromise
                .then(data => {
                    let result = data.data;

                    if (result.hasOwnProperty('isValid'))
                        return this.onSuccessResponseHandler(result, resolve, reject);

                    resolve(result);
                })
                .catch(error => {
                    let message = this.errorHandler(error);
                    console.log(error);
                    reject(Array.isArray(message) ? message : [message]);
                });
        });
    }

    onSuccessResponseHandler(result, resolve, reject) {
        if (result.isValid) {
            resolve(result.returnValue);
        }
        else {
            reject(result.errors)
        }
    }

    errorHandler(error) {
        const $rootScope = this.$rootScope,
            translate = this.translate;

        if (error.status === 401 && error.data === 'user is not authenticated')
            return $rootScope.$emit('onUserIsNotAuthenticated');

        const inValidMessages = ['The branch is expired', 'No token provided.', 'The branch is not active', 'The branch does not have subscription'];

        if (error.status === 403 && (inValidMessages.includes(error.data)))
            return $rootScope.$emit('onBranchIsInvalid');

        if (error.status === 403 && error.data === 'This feature is not active' && error.config.method !== 'GET')
            return translate(error.data);

        if (error.status === 400)
            return error.data;
        if (error.status === 403 && error.data === 'User do not have permission')
            return translate(error.data);

        if (error.status === 500)
            return translate('Internal error');
    }

    getHeaders(options) {
        const $rootScope = this.$rootScope;

        let base = { "api-caller": "STORM-Dashboard", "Cache-Control": "no-cache" };

        if (!options) {
            let tenantKey = this.environment.TENANT_KEY;


            if (!tenantKey) {
                $rootScope.$emit('onBranchIsInvalid');
                return
            }
            return Object.assign({}, { "x-access-token": tenantKey }, base);

        }

        if (options.userKeyAuth) {
            let userKey = this.environment.USER_KEY;

            if (!userKey) {
                $rootScope.$emit('onUserIsNotAuthenticated');
                throw new Error();
            }

            return Object.assign({}, { "authorization": userKey }, base);

        }

        if (options.i_sent_token_object)
            return options.i_sent_token_object;
    }

    get(url, data, options) {
        const $rootScope = this.$rootScope;

        if (!url) {
            return deferred;
        }

        let headers = this.getHeaders(options);
        let params;

        if ($rootScope.fiscalPeriodId && $rootScope.fiscalPeriodId.length > 1) {
            params = Object.assign({}, data, { fiscalPeriodId: $rootScope.fiscalPeriodId });
        } else {
            params = Object.assign({}, data, {});
        }

        return this.promise.create((resolve, reject) => {
            this.$http.get(url, { params, paramSerializer: '$httpParamSerializerJQLike', headers })
                .then(function (result) {
                    resolve(result.data);
                })
                .catch(function (error) {
                    this.errorHandler(error);
                    console.log(error);
                    reject(['Internal Error']);
                });
        });
    }

    post(url, data, options) {
        const $rootScope = this.$rootScope;
        let headers = this.getHeaders(options);
        if ($rootScope.fiscalPeriodId && $rootScope.fiscalPeriodId.length > 1) {
            return this.promisify($http.post(url, data, {
                headers,
                params: { fiscalPeriodId: $rootScope.fiscalPeriodId }
            }));
        } else {
            return this.promisify($http.post(url, data, { headers, params: {} }));
        }
    }

    put(url, data, options) {
        const $rootScope = this.$rootScope;

        let headers = this.getHeaders(options);
        if ($rootScope.fiscalPeriodId && $rootScope.fiscalPeriodId.length > 1) {
            return this.promisify($http.put(url, data, {
                headers,
                params: { fiscalPeriodId: $rootScope.fiscalPeriodId }
            }));
        } else {
            return this.promisify($http.put(url, data, { headers, params: {} }));
        }
    }

    delete(url, options) {
        const $rootScope = this.$rootScope;

        let headers = this.getHeaders(options);
        if ($rootScope.fiscalPeriodId && $rootScope.fiscalPeriodId.length > 1) {
            return this.promisify($http.delete(url, { headers, params: { fiscalPeriodId: $rootScope.fiscalPeriodId } }));
        } else {
            return this.promisify($http.delete(url, { headers, params: {} }));
        }
    }
}
