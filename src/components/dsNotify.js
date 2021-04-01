import template from './dsNotify.html';

class DsNotifyController {
    /* @ngInject */
    constructor($mdToast) {
        this.$mdToast = $mdToast;
        this.options = this.options || {};
    }

    close() {
        this.$mdToast.hide();
    }
}

export class DsNotifyService {
    /* @ngInject */
    constructor($mdToast) {
        this.$mdToast = $mdToast;
    }

    show(message, options) {
        options = options || {};

        this.$mdToast.show({
            hideDelay: options.hideDelay || 3000,
            position: 'top left',
            controller: DsNotifyController,
            controllerAs: 'model',
            bindToController: true,
            locals: { toastMessage: message, options },
            parent: document.getElementsByTagName('body')[0],
            template
        }).then(function (result) {

        }).catch(function (error) {

        });
    }
}
