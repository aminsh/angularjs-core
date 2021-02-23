import { columnsParser } from "./columnsParser";
import { footerParser } from "./footerParser";
import { keyboard, getName as keyboardGetName } from "../utils/keyboard";
import { template } from "lodash";
import { itemDetailParser } from "./itemDetailParser";

/* @ngInject */
export function dsDataTable($compile, $rootScope, $templateCache) {
    return {
        restrict: 'E',
        transclude: {
            'toolbar': '?dsDatatableToolbar',
            'body': 'dsDatatableBody',
            'footer': '?dsDatatableFooter'
        },
        scope: {
            name: '@',
            form: '=',
            items: '=',
            orderBy: '@',
            model: '=',
            removable: '=',
            addable: '=',
            selectable: '=',
            noHeader: '=',
            onCurrentChanged: '&',
            onDoubleClicked: '&',
            onItemRemoved: '&',
            onItemCreated: '&',
            onKeyPress: '&'
        },
        templateUrl: 'dsCore/datatable/dsDataTable.html',
        compile(tElement, tAttrs, transclude) {

            return function link(scope, element, attrs) {

                scope.local_removable = scope.removable === undefined
                    ? true
                    : scope.removable;

                scope.local_addable = scope.addable === undefined
                    ? true
                    : scope.addable;

                scope.local_selectable = scope.selectable === undefined
                    ? true
                    : scope.selectable;

                scope.local_showHeader = scope.noHeader === undefined
                    ? true
                    : !scope.noHeader;

                if (attrs.hasOwnProperty('bordered'))
                    scope.bordered = true;

                const $table = $('table', element),
                    $columns = $table.children('tbody').find('column'),
                    $footers = $table.children('tfoot').find('footer'),
                    $item_detail = $table.children('tbody').find('item-detail');

                const itemDetail = itemDetailParser($item_detail) || 'none';

                scope.columns = columnsParser($columns);

                const headerTemplate = $templateCache.get('dsCore/datatable/dataTableHeader-template.html');

                const rendered_header_template = _.template(headerTemplate)({
                    columns: scope.columns,
                });

                $table.children('thead').html(compile(rendered_header_template));


                const rowTemplate = $templateCache.get('dsCore/datatable/dataTableRow-template.html');

                const rendered_row_template = _.template(rowTemplate)({
                    columns: scope.columns,
                    itemDetail,
                    removable: scope.local_removable,
                });

                $table.children('tbody').html(compile(rendered_row_template));

                const footers = footerParser($footers);

                const footerTemplate = $templateCache.get('dsCore/datatable/dataTableFooter-template.html');

                const rendered_footer_template = _.template(footerTemplate)({
                    columns: scope.columns,
                    removable: scope.local_removable,
                    footers
                });

                $table.children('tfoot').html(compile(rendered_footer_template));

                scope.removeItem = item => {
                    if (scope.current === item)
                        scope.setCurrent(null);

                    scope.items.remove(item);

                    scope.onItemRemoved({ $item: item });
                };

                scope.addItem = () => {
                    let item = {};

                    if (!scope.items)
                        scope.items = [ {} ];

                    const instance = scope.onItemCreated({ $item: item });

                    if (instance)
                        item = instance;

                    scope.items.push(item);

                    scope.setCurrent(item);
                };

                let buffer = [];

                scope.keyDown = ($event) => {
                    buffer.push($event.keyCode);
                };

                scope.keyup = ($event, item) => {

                    let this_buffer = buffer.asEnumerable().distinct().toArray();
                    buffer = [];

                    let key;

                    if (this_buffer.length === 0)
                        return;
                    else if (this_buffer.length === 1)
                        key = this_buffer[0];
                    else {
                        return scope.onKeyPress({
                            $item: item,
                            $current: scope.current,
                            $field: $event.target.name,
                            $key: this_buffer
                        });
                    }

                    console.log('keyboard press : ', this_buffer.join('+'));

                    if (key === keyboard.INSERT)
                        scope.local_addable && scope.addItem();

                    const name = $event.target.name || $event.target.getAttribute('name');

                    if ([ keyboard.ENTER, keyboard.ARROW_LEFT ].includes(key)) {
                        !isOpenAnyDropDown() && next($event.currentTarget.id, name, key);
                    }

                    if (key === keyboard.ARROW_RIGHT) {
                        !isOpenAnyDropDown() && previous($event.currentTarget.id, name);
                    }

                    if (key === keyboard.ARROW_UP) {
                        !isOpenAnyDropDown() && up($event.currentTarget.id, name);
                    }

                    if (key === keyboard.ARROW_DOWN) {
                        !isOpenAnyDropDown() && down($event.currentTarget.id, name);
                    }

                    scope.onKeyPress({ $item: item, $field: $event.target.name, $key: key });

                };

                function isOpenAnyDropDown() {
                    return !!$('md-virtual-repeat-container').not('.ng-hide').length;
                }

                scope.setCurrent = (item, element) => {
                    if (!scope.local_selectable)
                        return;

                    scope.current = item;
                    scope.elementOnFocus = element;
                    scope.onCurrentChanged({ $current: item });
                };

                scope.onDblClicked = item => {
                    scope.onDoubleClicked({ $item: item });
                };

                function compile(html) {
                    if (!html.startsWith('<'))
                        return;
                    const linkFn = $compile(html);
                    return linkFn(scope);
                }

                $rootScope.$on(`${ scope.name }-focus-element`, (e, data) => {
                    setFocus(data.item.id, data.element);
                });

                $rootScope.$on(`${ scope.name }-keyDown`, (e, data) => {
                    scope.keyDown(data.$event);
                });

                $rootScope.$on(`${ scope.name }-keyUp`, (e, data) => {
                    scope.keyup(data.$event);
                });

                function next(rowId, inputName, key) {
                    let $tr = $(`#${ rowId }`, element);

                    let inputs = getInputs($tr);

                    let currentIndex = inputs.indexOf(inputName);

                    let nextInput = inputs[currentIndex + 1];

                    if (nextInput)
                        return setFocus(rowId, nextInput);

                    if (key !== keyboard.ENTER)
                        return;

                    down(rowId, inputs[0], true);

                }

                function previous(rowId, inputName) {
                    let $tr = $(`#${ rowId }`, element);

                    let inputs = getInputs($tr);

                    let currentIndex = inputs.indexOf(inputName);

                    let previousInput = inputs[currentIndex - 1];

                    if (previousInput)
                        setFocus(rowId, previousInput);
                    else ; //if not ...
                }

                function up(rowId, inputName) {
                    let rows = getRows().filter(id => !id.includes('detail')),
                        currentItemIndex = rows.indexOf(rowId);

                    let upperId = rows[currentItemIndex - 1];

                    if (!upperId)
                        return;

                    setFocus(upperId, inputName);
                }

                function down(rowId, inputName, canInsertIfDownNotExits) {
                    let rows = getRows().filter(id => !id.includes('detail')),
                        currentItemIndex = rows.indexOf(rowId);

                    let lowerId = rows[currentItemIndex + 1];

                    if (lowerId)
                        return setFocus(lowerId, inputName);

                    if (!canInsertIfDownNotExits)
                        return;

                    scope.addItem();
                }

                function getInputs($tr) {
                    let inputs = [];

                    $tr.find('.has-border-on-focus').each((i, item) => {
                        inputs.push($(item).attr('name'));
                    });

                    return inputs;
                }

                function getRows() {
                    let rows = [];

                    $table.find('tbody').find('tr')
                        .each((i, item) => {
                            rows.push($(item).attr('id'))
                        });

                    return rows;
                }


                function setFocus(rowId, element) {
                    let $tr = $(`#${ rowId }`, $table),
                        $tr_detail = $(`#${ rowId }-detail`, $table);

                    let $elm = $(`[name=${ element }]`, $tr);

                    if ($elm.length === 0)
                        $elm = $(`[name=${ element }]`, $tr_detail);

                    $elm.focus();
                }
            }
        }
    }
}
