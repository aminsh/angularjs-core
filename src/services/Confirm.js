export function Confirm(translate, $mdDialog, promise) {

    return (title, message) => {
        return promise.create((resolve) => {
            let confirm = $mdDialog.confirm()
                .title(title)
                .textContent(message)
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
