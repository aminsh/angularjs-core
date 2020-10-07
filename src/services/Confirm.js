export class Confirm {
    constructor(translate, $mdDialog, promise) {
        this.promise = promise;
        this.$mdDialog = $mdDialog;
        this.translate = translate;
    }

    confirm(title, message) {
        return this.promise.create((resolve) => {
            let confirm = this.$mdDialog.confirm()
                .title(title)
                .textContent(message)
                .ariaLabel('Confirm')
                .ok(this.translate('Yes'))
                .cancel(this.translate('No'))
                .multiple(true);

            confirm._options.multiple = true;

            this.$mdDialog.show(confirm).then(function () {
                resolve(true);
            }, function () {
                resolve(false);
            });
        });
    }
}
