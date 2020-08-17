import { Guid } from '../utils/string';
import * as _ from 'lodash';

export function combobox(httpRequest, promise, $timeout, $window) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            onChanged: '&onItemChanged',
            //onRemoved: '&onItemChanged',
            onBound: '&onItemBound',
            onCreate: '&onCreate',
            displayField: '@',
            valueField: '@',
            url: '<',
            option: '<',
            form: '=',
            label: '@',
            inputClass: '@',
            onInputFocus: '&',
            dataSource: '=',
            displayExpression: '@',
            filterExpression: '@',
            filterOperator: '@'
        },
        templateUrl: 'dsCore/controls/combobox.html',
        compile(tElement, tAttrs) {

            let mdAutocomplete = $('md-autocomplete', tElement),
                itemTemplate = $('md-item-template', mdAutocomplete);

            mdAutocomplete.attr('md-item-text', `item.${tAttrs.displayField}`);
            //mdAutocomplete.attr('md-floating-label', tAttrs.label);

            if (tAttrs.hasOwnProperty('required'))
                mdAutocomplete.attr('required', '');

            if (tAttrs.hasOwnProperty('ngRequired'))
                mdAutocomplete.attr('ng-required', tAttrs['ngRequired']);

            let inputId = Guid.new();

            mdAutocomplete.attr('md-input-id', inputId);

            if (tAttrs.hasOwnProperty('name')) {
                mdAutocomplete.attr('md-input-name', tAttrs.name);
                tElement.removeAttr('name');
            }

            if (tAttrs.hasOwnProperty('mdMenuLarge'))
                mdAutocomplete.attr('md-menu-container-class', 'md-menu-large');

            if (tAttrs.hasOwnProperty('placeholder')) {
                mdAutocomplete.attr('placeholder', tAttrs.placeholder);
                tElement.removeAttr('placeholder');
            }

            let msg = $('#msg', tElement);
            msg.attr('ng-messages', `form.${tAttrs.name}.$error`);
            msg.attr('ng-if', `form.${tAttrs.name}.$dirty`);

            if (!tAttrs.hasOwnProperty('label'))
                mdAutocomplete.removeAttr('md-floating-label');

            $('span', itemTemplate).text(`{{item.${tAttrs.displayField}}}`);

            return function link(scope, element, attrs, ngModel) {
                if (!scope.option)
                    scope.option = {};

                let defaultFilter = (scope.option && scope.option.filter && Array.isArray(scope.option.filter))
                    ? scope.option.filter
                    : [];

                const dataSource = scope.option.dataSource,
                    oDataQuery = scope.option.oDataQuery;

                $timeout(() => {
                    const $input = $(`#${inputId}`, element);

                    if (attrs.inputClass)
                        $input.addClass(attrs.inputClass);

                    $input.focus(function () {
                        scope.onInputFocus();

                        if (scope.$root.$$phase !== '$apply' && scope.$root.$$phase !== '$digest') {
                            scope.$apply();
                        }
                    });

                    if (attrs.hasOwnProperty('blurEnter'))
                        $window.setEnterBlur($input);

                }, 500);

                let items = false,
                    updatedFromModel = false,
                    updatedFromMe = false;

                scope.localDisabled = false;
                scope.hasCreate = attrs.hasOwnProperty('onCreate');

                scope.create = text => scope.onCreate({ $search: text });

                /*scope.keyUp = function (e, text) {
                    if (e.keyCode === 13 && (items && items.length > 0)) {
                        scope.create(text);
                    }
                };*/

                scope.searchQuery = query => {
                    scope.k = search(query);
                    return scope.k;
                };

                scope.selectedItemChanged = item => {
                    if (updatedFromModel) {
                        updatedFromModel = false;
                        scope.onBound({ $item: item });
                        return;
                    }

                    if (!item) {
                        ngModel.$setViewValue(null);
                        updatedFromMe = true;
                        scope.onChanged({ $item: item });
                        return;
                    }

                    updatedFromMe = true;

                    if (attrs.hasOwnProperty('valueField'))
                        ngModel.$setViewValue(item[attrs.valueField]);
                    else
                        ngModel.$setViewValue(item);

                    scope.onChanged({ $item: item });
                };

                scope.$watch(
                    () => ngModel.$modelValue,
                    newValue => {
                        if (updatedFromMe) {
                            updatedFromMe = false;
                            return;
                        }

                        if (!newValue) {
                            if (scope.selectedItem === null)
                                return;

                            updatedFromModel = true;
                            scope.selectedItem = null;
                            return;
                        }

                        scope.localDisabled = true;

                        find(newValue)
                            .then(data => {
                                updatedFromModel = true;
                                scope.selectedItem = data[0];
                            })
                            .finally(() => scope.localDisabled = false);
                    }
                );

                function find(value) {
                    const parameters = {
                        filter: {
                            logic: 'and',
                            filters: [
                                { field: attrs.valueField, operator: 'eq', value },
                                ...defaultFilter
                            ]
                        },
                        sort: [],
                        take: 1,
                        skip: 0
                    };

                    if (dataSource) {
                        return promise.create(resolve => {
                            dataSource.filter(`it.${attrs.valueField} == '${value}'`)
                                .toArray()
                                .then(result => {
                                    result.forEach(e => {
                                        e[attrs.displayField] = _.template(attrs.displayExpression)({ item: e });
                                    });
                                    resolve(result);
                                });
                        });

                    } else if (oDataQuery) {
                        return promise.create(resolve => {
                            oDataQueryExecute(parameters)
                                .then(result => {
                                    if (attrs.displayExpression)
                                        result.forEach(e => {
                                            e[attrs.displayField] = _.template(attrs.displayExpression)({ item: e });
                                        });

                                    resolve(result);
                                });
                        });
                    } else {
                        return getData(parameters)
                    }
                }

                function search(query) {
                    let parameters = {
                        filter: {
                            logic: 'and',
                            filters: [
                                ...(query ? [{
                                    field: attrs.displayField,
                                    operator: attrs.filterOperator ? attrs.filterOperator : 'contains',
                                    value: query
                                }] : []),
                                ...defaultFilter
                            ]
                        },
                        sort: [],
                        take: 20,
                        skip: 0
                    };

                    if (dataSource) {
                        return promise.create(resolve => {
                            dataSource.filter(_.template(attrs.filterExpression)({ search: query }))
                                .take(20)
                                .toArray()
                                .then(result => {
                                    result.forEach(e => {
                                        e[attrs.displayField] = _.template(attrs.displayExpression)({ item: e });
                                    });
                                    resolve(result);
                                });
                        });

                    } else if (oDataQuery) {
                        if (attrs.filterExpression)
                            parameters = {
                                filter: {
                                    logic: 'and',
                                    filters: [
                                        ...(query ? [{
                                            operator: 'raw',
                                            expression: _.template(attrs.filterExpression)({ search: query })
                                        }] : []),
                                        ...defaultFilter
                                    ]
                                },
                                sort: [],
                                take: 20,
                                skip: 0
                            };
                        return promise.create(resolve => {
                            oDataQueryExecute(parameters)
                                .then(result => {
                                    if (attrs.displayExpression)
                                        result.forEach(e => {
                                            e[attrs.displayField] = _.template(attrs.displayExpression)({ item: e });
                                        });

                                    resolve(result);
                                });
                        });


                    } else {
                        return promise.create((resolve, reject) => {
                            apiPromise.get(scope.url, parameters)
                                .then(result => {
                                    resolve(result.data);
                                    //items = result.data;
                                })
                                .catch(err => reject(err));
                        });
                    }
                }

                function getData(parameters) {
                    return promise.create((resolve, reject) => {
                        apiPromise.get(scope.url, parameters)
                            .then(result => {
                                resolve(result.data);
                                //items = result.data;
                            })
                            .catch(err => reject(err));
                    });
                }

                function oDataQueryExecute(parameters) {
                    return promise.create((resolve, reject) => {
                        oDataQuery.executeAsKendo(parameters)
                            .then(result => resolve(result.data))
                            .catch(err => reject(err));
                    })
                }
            }
        }
    }
}
