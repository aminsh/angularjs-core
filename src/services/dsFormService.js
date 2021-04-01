export class DsFormService {
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

    setDirtySubForm(form, prefix) {
        Object.keys(form).asEnumerable()
            .where(key => key.includes(prefix || 'form-'))
            .toArray()
            .forEach(key => this.setDirty(form[key]));
    }

}
