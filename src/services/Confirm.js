/* @ngInject */
export function Confirm(translate, $mdDialog, promise) {
    return (params) => {
        return promise.create((resolve) => {
            let confirm = $mdDialog.confirm()
                .title(translate(params.title))
                .textContent(translate(params.message))
                .ariaLabel('Confirm')
                .ok(translate('Yes'))
                .cancel(translate('No'))
                .multiple(true);

            confirm._options.multiple = true;

            $mdDialog.show(confirm).then(function () {
                resolve(true);
            }, function () {
                resolve(false);
            });
        });
    }
}
