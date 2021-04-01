import { getValidators, getAttrsValidatorShow } from "./dsDataTableValidator";

const constants = {
    HEADER: 'header',
    TITLE: 'dt-title',
    HEADER_TEMPLATE: 'column-header-template',
    MODEL: 'model',
    NAME: 'name',
    ALIGN: 'align',
    HEADER_ALIGN: 'header-align',
    WIDTH: 'width',
    REQUIRED_ATTRIBUTE: '[required]',
    REPEAT: 'repeat',
    IF: 'if',
    NG_CLASS: 'ng-class',
    EDITOR_TYPE: 'editor',
    EDITOR: 'column-editor',
    EDITOR_TEMPLATE: 'column-editor-template',
    SELECT_OPTION_REPEAT_EXPRESSION: 'repeat-expression',
    SELECT_OPTION_VALUE: 'value',
    SELECT_OPTION_DISPLAY: 'display',
    SELECT_SEARCHABLE: 'searchable',
    SELECT_IMAGE_SRC: 'image-src',
    FOOTER: 'footer',
    NO_COMPILE: 'no-compile-',
    CLASS: 'class',
    PREFIX: 'dt-'
};

export function columnsParser($columns) {
    let columns = [];

    $columns.each(function (i, item) {
        let column = columnParser(i, $(item));
        columns.push(column);
    });

    return columns;
}

function columnParser(i, $item) {
    let column = {
        label: $item.attr(constants.HEADER),
        title: $item.attr(constants.TITLE),
        align: $item.attr(constants.ALIGN),
        header_align: $item.attr(constants.HEADER_ALIGN),
        width: $item.attr(constants.WIDTH),
        header_template: '',
        ngIf: $item.attr(constants.IF),
        ngModel: $item.attr(constants.MODEL),
        name: $item.attr(constants.NAME),
        footer: $item.attr(constants.FOOTER),
        class: $item.attr(constants.CLASS)
    };

    column.ngIf = `columnMetadata.${ column.name }.show` + (column.ngIf ? ` && ${ column.ngIf }` : '');

    if ($item.find(constants.HEADER_TEMPLATE).length > 0) {
        column.header_template = replaceTemplate($item
            .find(constants.HEADER_TEMPLATE)
            .html());
    }

    column.editor = editorParser($item);

    return column;
}

function editorParser($item) {
    let $editor = $item.find(constants.EDITOR);

    let editor = {
        element: $editor.attr(constants.EDITOR_TYPE),
        class: $editor.attr(constants.CLASS)
    };

    editor = Object.assign({}, editor, getAttrs($editor), getAttrsValidatorShow($item.attr('name')));

    if ($editor.is(constants.REQUIRED_ATTRIBUTE))
        editor.required = true;

    if (editor.element === 'combo') {
        if (editor.required)
            editor['md-require-match'] = true;
        editor.innerTemplate = $editor.html()
    }

    if (editor.element === 'select') {
        editor.options = {
            repeatExpression: $editor.attr(constants.SELECT_OPTION_REPEAT_EXPRESSION),
            value: $editor.attr(constants.SELECT_OPTION_VALUE),
            display: $editor.attr(constants.SELECT_OPTION_DISPLAY),
            searchable: hasAttr($editor, constants.SELECT_SEARCHABLE),
            imageSrc: $editor.attr(constants.SELECT_IMAGE_SRC)
        };
    }

    if (editor.element === 'switch') {

    }

    if (editor.element === 'custom') {
        let $editor_template = $editor.find(constants.EDITOR_TEMPLATE);

        editor.template_validators = customTemplateValidatorParser($editor_template);
        editor.template = replaceTemplate($editor_template.html());
    } else
        editor.validators = getValidators(editor, validatorParser($item));

    return editor.element ? editor : null;
}

function hasAttr($tag, attrName) {
    let attr = $tag.attr(attrName);
    return typeof attr !== typeof undefined && attr !== false
}

function validatorParser($item) {
    let validators = {};

    if ($item.find('validators').length === 0)
        return;

    $item.find('validators').find('validator').each(function (i, item) {
        let attrs = getAttrs($(item));
        validators[ attrs.name ] = attrs.message;
    });

    return validators;
}

function customTemplateValidatorParser($template) {
    let validators = [];

    $template.find('[ds-input]')
        .each(function (i, item) {
            let $item = $(item),
                name = $item.attr('name'),
                input_attr = getAttrs($item);

            let input_validators = getValidators(input_attr);

            validators.push({ name, validators: input_validators });

            let attr_validator_show = getAttrsValidatorShow(name);

            Object.keys(attr_validator_show).forEach(key => {
                $item.attr(key, attr_validator_show[ key ]);
            })
        });

    return validators;
}

export function getAttrs($element, item) {
    item = item || {
        'ng-focus': `setCurrent(item,'${$element.attr('name')}')`
    };

    $element.each(function () {
        $.each(this.attributes, function () {
            // this.attributes is not a plain object, but an array
            // of attribute nodes, which contain both the name and value
            if (this.specified) {
                item[ replaceTemplate(this.name) ] = this.value;
            }
        });
    });


    return item;
}

export function replaceTemplate(template) {
    return template
        .replaceAll(constants.REPEAT, 'ng-repeat')
        .replaceAll(constants.IF, 'ng-if')
        .replaceAll(constants.NO_COMPILE, '')
        .replaceAll(constants.PREFIX, '')
}
