import dsMultiSelectTemplate from './dsMultiSelect.html';

export class DsMultiSelect {
    /* @ngInject */
    constructor($rootScope, $scope, $attrs, dsPromise) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$attrs = $attrs;
        this.dsPromise = dsPromise;
        this.ngModelCtrl = null;
        this.dataSource = null;
        this.updatedByMe = false;
        this.selectedItems = [];
    }

    $apply() {
        if (!this.$rootScope.$$phase) {
            this.$scope.$apply();
        }
    }

    $onInit() {
        this.$scope.$watch(
            () => this.ngModelCtrl.$modelValue,
            newVal => {
                if (this.updatedByMe) {
                    this.updatedByMe = false;
                    return;
                }

                if ((newVal || []).length === 0) {
                    this.selectedItems = [];
                    return;
                }

                this.find(newVal).then(result => {
                    this.selectedItems = result;
                });
            }
        );
    }

    async search(query) {
        const parameters = {
            filter: {
                logic: 'and',
                filters: [
                    ...(query ? [ {
                        field: this.$attrs.displayField,
                        operator: 'contains',
                        value: query
                    } ] : [])
                ]
            },
            sort: [],
            take: 20,
            skip: 0
        };

        const result = await this.dsPromise.resolve(this.dataSource.find(parameters));

        this.$apply();

        return result.data;
    }

    async find(value) {
        const parameters = {
            filter: {
                logic: 'and',
                filters: [
                    {
                        field: this.$attrs.valueField,
                        operator: 'in',
                        value: value.map(e => typeof e === "string" ? e : e[this.$attrs.valueField])
                    }
                ]
            },
            sort: []
        };

        const result = await this.dsPromise.resolve(this.dataSource.find(parameters));
        this.$apply();
        return result.data;
    }

    onChanged(selectedItems) {
        const ngModel = this.ngModelCtrl;
        this.updatedByMe = true;

        if (selectedItems.length === 0) {
            ngModel.$setViewValue([]);
            return;
        }

        if (this.$attrs.hasOwnProperty('valueField'))
            ngModel.$setViewValue(selectedItems.map(e => e[this.$attrs.valueField]));
        else
            ngModel.$setViewValue(selectedItems);
    }

    transform(chip) {
        if (angular.isObject(chip)) {
            return chip;
        }
    }
}

/**
 * @ngdoc component
 * @name CoreModule.component:dsMultiSelect
 * @param {Object} dsDataSource
 * @param {String} displayField
 * @param {String} valueField
 */
export const dsMultiSelectComponent = {
    controller: DsMultiSelect,
    controllerAs: '$multiSelect',
    template: /* @ngInject */ function ($element, $attrs) {
        const $container = $(dsMultiSelectTemplate);
        const $mdAutocomplete = $container.find('md-autocomplete');

        if ($attrs.hasOwnProperty('mdMenuLarge'))
            $mdAutocomplete.attr('md-menu-container-class', 'md-menu-large');

        $mdAutocomplete.attr('md-item-text', `$item.${ $attrs.displayField }`);

        $mdAutocomplete.find('span[md-highlight-text]').text(`{{$item.${ $attrs.displayField }}}`);

        const $dsTemplate = $element.find('ds-template').get(0);

        if ($dsTemplate) {
            const html = $dsTemplate.innerHTML.replaceAll('$item', '$chip');
            $container.find('md-chip-template').html(html);
        }

        return $container.get(0).outerHTML;
    },
    bindings: {
        dataSource: '<dsDataSource',
        displayField: '@',
        valueField: '@'
    },
    require: {
        ngModelCtrl: 'ngModel'
    }
}


