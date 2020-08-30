export class DialogService {
    /* @ngInject */
    constructor($mdDialog, $rootScope, promise) {
        this.$mdDialog = $mdDialog;
        this.$rootScope = $rootScope;
        this.promise = promise;
    }

    createForRoute(options) {
        this.$mdDialog
            .show({
                controller: options.controller,
                controllerAs: options.controllerAs,
                templateUrl: options.templateUrl,
                parent: angular.element(document.body),
                //targetEvent: ev,
                //clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: true,
                multiple: true,
                resolve: options.resolve,
                locals: Object.assign({ dsProvider: 'fromRoute' }, options.locals),
                onRemoving: () => {
                    if (!isOpen)
                        return;

                    this.$rootScope.up();
                    starter();
                }
            })
            .then(() => {
            })
            .catch(() => {
            });

        let isOpen = false,
            stateName;

        let starter = this.$rootScope.$on('$stateChangeSuccess', (event, toState) => {
            if (!isOpen) {
                isOpen = true;
                stateName = toState.name;
            } else if (isOpen && toState.name !== stateName) {
                this.$mdDialog.hide();
                isOpen = false;
                starter();
            }
        });

    }

    hide(params) {
        this.$mdDialog.hide(params);
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}

export function DsDialog(options) {
    return target => {
        Reflect.defineMetadata('dialog:options', options, target);
    }
}

export function registerDialog(DialogClass) {
    let options = Reflect.getMetadata('dialog:options', DialogClass);

    return {
        provide: options.provide,
        useFactory: (promise, $mdDialog) => dialogFactory(promise, $mdDialog, Object.assign({}, options, {
            controller: DialogClass,
            controllerAs: options.controllerAs || '$ctrl',
            provide: options.provide || camelize(DialogClass.name)
        })),
        deps: [ 'promise', '$mdDialog' ]
    }
}

export const DialogProvider = {
    fromService: 'fromService',
    fromRoute: 'fromRoute'
}

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

function dialogFactory(promise, $mdDialog, options) {
    return {
        show: parameters => {
            return promise.create((resolve, reject) => {
                $mdDialog
                    .show({
                        controller: options.controller,
                        controllerAs: options.controllerAs,
                        template: options.template,
                        parent: angular.element(document.body),
                        //targetEvent: ev,
                        //clickOutsideToClose: true,
                        resolve: options.resolve,
                        escapeToClose: true,
                        fullscreen: true,
                        multiple: true,
                        locals: Object.assign({ dsProvider: 'fromService' }, { data: parameters || {} })
                    })
                    .then(result => resolve(result))
                    .catch(err => reject(err));
            });
        }
    }
}