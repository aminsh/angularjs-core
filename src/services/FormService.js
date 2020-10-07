export class FormService {
    constructor() {
    }

    setDirty(form) {
        angular.forEach(form.$error, function (type) {
            angular.forEach(type, function (field) {
                field.$setDirty();
            });
        });
        return form;
    }

    setClean(form) {
        angular.forEach(form.$error, function (type) {
            angular.forEach(type, function (field) {
                field.$setPristine();
            });
        });
    }

    setDirtySubForm(form) {
        Object.keys(form).asEnumerable()
            .where(key => key.includes('form-'))
            .toArray()
            .forEach(key => setDirty(form[key]));
    }

}
