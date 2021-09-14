import { Guid } from '../utils';
import * as _ from 'lodash';
import template from './dsCombobox.html';

/**
 * @ngdoc directive
 * @name CoreModule.directive:dsCombobox
 * @restrict E
 * @scope
 * @param {String} displayField Display
 * @param {String} valueField Value like ID
 * @param {String} url url for direct request
 * @param {String} label caption
 * @param {Object} form Angular form for validation
 * @param {String} inputClass inner input class
 * @param {Object} options for set oDataQuery
 * @param {String} displayExpression  instead display field (You can use underacore _)
 * @param {String} filterExpression  for use oData filter syntax (You can use underacore _)
 * @param {Function} onChanged on ngModel changed
 * @param {Function} onBound on ngModel bound for then first time
 * @param {Function} onCreate on user click on plus button
 * @param {Function} onInputFocus on inner input focus
 * @param {String} filterOperator oData filter operator
 * @param {String} filterOperator oData filter operator
 * @param {String} filterOperator oData filter operator
 *
 * @description
 *
 *
 * @example
 */

/* @ngInject */
export function dsCombobox(dsHttpRequest, dsPromise, $timeout, $window) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            onChanged: '&onItemChanged',
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
            filterOperator: '@',
            ngRequired: '='
        },
        template: function (element, attrs) {
            attrs['$userTemplate'] = element.clone();
            return template;
        },
        compile(tElement, tAttrs) {
            const $userTemplate = tAttrs['$userTemplate'];

            let mdAutocomplete = $('md-autocomplete', tElement),
                itemTemplate = $('md-item-template', mdAutocomplete);

            mdAutocomplete.attr('md-item-text', `$item.${ tAttrs.displayField }`);

            if (tAttrs.hasOwnProperty('required'))
                mdAutocomplete.attr('required', '');

            if (tAttrs.hasOwnProperty('ngRequired'))
                mdAutocomplete.attr('ng-required', 'ngRequired');

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
            msg.attr('ng-messages', `form.${ tAttrs.name }.$error`);
            msg.attr('ng-if', `form.${ tAttrs.name }.$dirty`);

            if (!tAttrs.hasOwnProperty('label'))
                mdAutocomplete.removeAttr('md-floating-label');


            const $dsItemTemplate = $userTemplate.find('ds-item-template');

            if($dsItemTemplate.length > 0) {
               itemTemplate.html($dsItemTemplate.html());
            }
            else {
                $('span', itemTemplate).text(`{{$item.${ tAttrs.displayField }}}`);
            }
            return function link(scope, element, attrs, ngModel) {
                if (!scope.option)
                    scope.option = {};

                let defaultFilter = (scope.option && scope.option.filter && Array.isArray(scope.option.filter))
                    ? scope.option.filter
                    : [];

                const dataSource = scope.option.dataSource,
                    oDataQuery = scope.option.oDataQuery;

                $timeout(() => {
                    const $input = $(`#${ inputId }`, element);

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

                if(attrs.hasOwnProperty('onCreate')) {
                    let $elem = $(element).find('md-virtual-repeat-container');
                    $elem.addClass('has-create');
                    $(element[0]).attr('has-create', true);
                }

                scope.create = text => scope.onCreate({ $search: text });

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
                        return dsPromise.create(resolve => {
                            dataSource.filter(`it.${ attrs.valueField } == '${ value }'`)
                                .toArray()
                                .then(result => {
                                    result.forEach(e => {
                                        e[attrs.displayField] = _.template(attrs.displayExpression)({ item: e });
                                    });
                                    resolve(result);
                                });
                        });

                    } else if (oDataQuery) {
                        return dsPromise.create(resolve => {
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
                                ...(query ? [ {
                                    field: attrs.displayField,
                                    operator: attrs.filterOperator ? attrs.filterOperator : 'contains',
                                    value: query
                                } ] : []),
                                ...defaultFilter
                            ]
                        },
                        sort: [],
                        take: 20,
                        skip: 0
                    };

                    if (dataSource) {
                        return dsPromise.create(resolve => {
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
                                        ...(query ? [ {
                                            operator: 'raw',
                                            expression: _.template(attrs.filterExpression)({ search: query })
                                        } ] : []),
                                        ...defaultFilter
                                    ]
                                },
                                sort: [],
                                take: 20,
                                skip: 0
                            };
                        return dsPromise.create(resolve => {
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
                        return dsPromise.create((resolve, reject) => {
                            dsHttpRequest.get(scope.url, parameters)
                                .then(result => {
                                    resolve(result.data);
                                })
                                .catch(err => reject(err));
                        });
                    }
                }

                function getData(parameters) {
                    return dsPromise.create((resolve, reject) => {
                        dsHttpRequest.get(scope.url, parameters)
                            .then(result => {
                                resolve(result.data);
                            })
                            .catch(err => reject(err));
                    });
                }

                function oDataQueryExecute(parameters) {
                    return dsPromise.create((resolve, reject) => {
                        oDataQuery.executeAsKendo(parameters)
                            .then(result => resolve(result.data))
                            .catch(err => reject(err));
                    })
                }
            }
        }
    }
}
