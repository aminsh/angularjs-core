const default_validator_messages = {
    'required': 'This field is required',
    'md-require-match': 'Please select an existing item',
    'notShouldBeZero': 'This field should have a value not equal to zero',
};

export function getValidators(column_attrs, column_validators) {

    let validators = Object.assign({}, default_validator_messages, column_validators);

    const validators_on_input = Object.keys(column_attrs)
        .map(attr => attr === 'md-require-match' ? 'md-require-match' : camelize(attr))
        .filter(attr => Object.keys(validators).includes(attr))
        .map(validator => ( {
            name: validator,
            message: validators[ validator ]
        } ));

    return validators_on_input;
}

export function getAttrsValidatorShow(name) {
    return {
        'uib-tooltip-template': `'${name}_validator_template'`,
        'tooltip-enable': `form['form-'+ $index].${name}.$invalid && form['form-'+ $index].${name}.$dirty`,
        'tooltip-class': 'error-tooltip',
        'tooltip-placement': "bottom"
    }
}

export function destroyValidators(column_names, $templateCache) {
    column_names.forEach(name => $templateCache.remove(`${name}_validator_template`));
}

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
    })
        .replace(/\s+/g, '')
        .replaceAll('-', '');
}