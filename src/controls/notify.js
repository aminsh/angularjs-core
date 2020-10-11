export class NotifyController {
    constructor($mdToast, navigate) {
        this.$mdToast = $mdToast;
        this.navigate = navigate;

        this.options = this.options || {};
    }

    show() {
        if (!this.options.show)
            return;

        this.navigate(this.options.show.route, this.options.show.parameters);
    }

    close() {
        this.$mdToast.hide();
    }
}

export class NotifyService {
    constructor($mdToast) {
        this.$mdToast = $mdToast;
    }

    show(message, options) {
        options = options || {};

        this.$mdToast.show({
            hideDelay: options.hideDelay || 3000,
            position: 'top left',
            controller: 'notifyController',
            controllerAs: 'model',
            bindToController: true,
            locals: { toastMessage: message, options },
            //parent: document.getElementById('page-wrapper'),
            parent: document.getElementsByTagName('body')[0],
            templateUrl: 'partials/directives/notify.html'
        }).then(function (result) {

        }).catch(function (error) {

        });
    }
}