import { camelize } from "../utils";

export class DsDialogService {
    /* @ngInject */
    constructor($mdDialog, $state, $transitions, dsPromise) {
        this.$mdDialog = $mdDialog;
        this.dsPromise = dsPromise;
        this.$state = $state;
        this.$transitions = $transitions;
    }

    createForService(options) {
        return dialogFactory(this.dsPromise, this.$mdDialog, options);
    }

    createForRoute(options) {
        this.$mdDialog
            .show({
                controller: options.controller,
                controllerAs: options.controllerAs,
                template: options.template,
                templateUrl: options.templateUrl,
                parent: angular.element(document.body),
                targetEvent: options.event,
                clickOutsideToClose: options.clickOutsideToClose || false,
                escapeToClose: true,
                fullscreen: true,
                multiple: true,
                resolve: options.resolve,
                locals: Object.assign({ dsProvider: 'fromRoute' }, options.locals),
                onRemoving: () => {
                    if (!isOpen)
                        return;

                    this.$state.go('^');
                    deregisterHook();
                }
            })
            .then(() => {
            })
            .catch(() => {
            });

        let isOpen = false,
            stateName;

        const deregisterHook = this.$transitions.onSuccess({}, trans => {
            const current = trans.router.stateService.$current;

            if (!isOpen) {
                isOpen = true;
                stateName = current.name;
            } else if (isOpen && current.name !== stateName) {
                this.$mdDialog.hide();
                isOpen = false;
                deregisterHook();
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
        useFactory: (dsPromise, $mdDialog) => dialogFactory(dsPromise, $mdDialog, Object.assign({}, options, {
            controller: DialogClass,
            controllerAs: options.controllerAs || '$ctrl',
            provide: options.provide || camelize(DialogClass.name)
        })),
        deps: [ 'dsPromise', '$mdDialog' ]
    }
}

export const DialogProvider = {
    fromService: 'fromService',
    fromRoute: 'fromRoute'
}

function dialogFactory(dsPromise, $mdDialog, options) {
    return {
        show: parameters => {
            return dsPromise.create((resolve, reject) => {
                $mdDialog
                    .show({
                        controller: options.controller,
                        controllerAs: options.controllerAs,
                        template: options.template,
                        templateUrl: options.templateUrl,
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
