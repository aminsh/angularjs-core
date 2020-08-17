import { getAttrs, replaceTemplate } from "./columnsParser";
import { getValidators, getAttrsValidatorShow } from "./dsDataTableValidator";

export function itemDetailParser($itemDetail) {
    if($itemDetail.length === 0)
        return;

    let attrs = getAttrs($itemDetail);

    delete attrs[ 'ng-focus' ];

    let validators = [];

    $itemDetail.find('[ds-input]')
        .each(function (i, item) {
            let $item = $(item),
                name = $item.attr('name'),
                customValidators = validatorParser($itemDetail, name),
                input_attr = getAttrs($item);

            let input_validators = getValidators(input_attr, customValidators);

            validators.push({ name, validators: input_validators });

            let attr_validator_show = getAttrsValidatorShow(name);

            Object.keys(attr_validator_show).forEach(key => {
                $item.attr(key, attr_validator_show[ key ]);
            })
        });

    return {
        if: $itemDetail.attr('if'),
        template: replaceTemplate($itemDetail.html()),
        attrs,
        validators
    };
}

function validatorParser($itemDetail, name) {
    let validators = {};

    if ($itemDetail.find(`validators[name=${name}]`).length === 0)
        return;

    $itemDetail.find(`validators[name=${name}]`).find('validator').each(function (i, item) {
        Object.assign(validators, getAttrs($(item)));
    });

    return validators;
}