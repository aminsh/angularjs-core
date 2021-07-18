/* @ngInject */
export function dsPrompt(dsTranslate, dsPromise, $mdDialog) {
    return option => {
        return dsPromise.create((resolve, reject) => {
            let confirm = $mdDialog.prompt()
                .title(option.title)
                .textContent(option.text)
                .placeholder(dsTranslate('title'))
                .ariaLabel('title')
                .initialValue(option.defaultValue)
                .required(true)
                .ok(dsTranslate('confirm'))
                .cancel(dsTranslate('cancel'));

            confirm._options.multiple = true;

            $mdDialog.show(confirm).then(function (result) {
                resolve(result);
            }, function () {
                reject();
            });
        });
    }
}
