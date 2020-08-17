import { getAttrs } from "./columnsParser";

export function footerParser($footers) {
    let footers = [];

    $footers.each(function (i, footer) {
        const $footer = $(footer);

        footers.push({ items: rowParser($footer), attrs: getAttrs($footer, {}) });
    });

    return footers;
}

function rowParser($footer) {
    let items = [];

    $footer.find('footer-item').each(function (i, item) {
        items.push(cellParser($(item)));
    });

    return items;
}

function cellParser($item) {
    let item = {
        column_count: $item.attr('column-count') || 1,
        row_count: $item.attr('row-count') || 1,
        template: $item.html(),
        attrs: getAttrs($item)
    };

    if (item.attrs.hasOwnProperty('no-border')) {
        item.attrs.class = (item.attrs.class || '') + ' ds-dataTable-footer-cell-no-border';
        delete item.attrs[ 'no-border' ];
    }

    if (item.attrs.hasOwnProperty('bordered')) {
        item.attrs.class = (item.attrs.class || '') + ' ds-dataTable-footer-cell-bordered';
        delete item.attrs[ 'bordered' ];
    }

    delete item.attrs[ 'column-count' ];
    delete item.attrs[ 'ng-focus' ];

    delete item.attrs.template;

    return item;
}