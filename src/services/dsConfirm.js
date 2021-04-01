/* @ngInject */
export function dsConfirm(dsTranslate, $mdDialog, dsPromise) {
    return (params) => {
        return dsPromise.create((resolve) => {
            let confirm = $mdDialog.confirm()
                .title(dsTranslate(params.title))
                .textContent(dsTranslate(params.message))
                .ariaLabel('Confirm')
                .ok(dsTranslate('Yes'))
                .cancel(dsTranslate('No'))
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
