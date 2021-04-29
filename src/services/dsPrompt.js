/* @ngInject */
export function dsPrompt(translate, dsPromise, $mdDialog) {
    return option => {
        return dsPromise.create((resolve, reject) => {
            let confirm = $mdDialog.prompt()
                .title(option.title)
                .textContent(option.text)
                .placeholder(translate('Title'))
                .ariaLabel('Title')
                .initialValue(option.defaultValue)
                .required(true)
                .ok(translate('Confirm'))
                .cancel(translate('Cancel'));

            confirm._options.multiple = true;

            $mdDialog.show(confirm).then(function (result) {
                resolve(result);
            }, function () {
                reject();
            });
        });
    }
}
