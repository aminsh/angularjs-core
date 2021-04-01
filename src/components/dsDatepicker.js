import moment from 'moment-jalaali'
import template from './dsDatepicker.html';

/**
 * @ngdoc directive
 * @name CoreModule.directive:dsDatepicker
 * @restrict E
 * @require ngModel
 * @scope
 * @param {Boolean} ngDisabled use expression
 * @param {String} label caption of datepicker
 *
 * @description
 *
 *
 * @example
 */

/* @ngInject */
export function dsDatepicker() {
    return {
        require: 'ngModel',
        restrict: 'E',
        template,
        scope: {
            ngModel: '=',
            ngDisabled: '=',
            label: '@'
        },
        link: (scope, element, attrs, ngModel) => {
            if (!attrs.hasOwnProperty('noAddedClass'))
                $(element).addClass('ds-datepicker');
            const $input = element.find('input');
            $input.attr('name', attrs.name);
            if (attrs.hasOwnProperty('inputClass'))
                $input.addClass(attrs.inputClass);

            scope.localDate = null;

            scope.$watch(
                () => ngModel.$modelValue,
                newValue => {
                    if (!newValue) {
                        scope.localDate = null;
                        return;
                    }
                    scope.localDate = moment(newValue, 'jYYYY/jMM/jDD')._d;
                }
            );

            scope.$watch('localDate', newValue => {
                    if (!newValue)
                        return;
                    ngModel.$setViewValue(getDate(scope.localDate))
                }
            );

            function getDate(date) {

                if (typeof date === 'string')
                    date = new Date(date);

                let dateToString = `${ date.getFullYear() }/${ date.getMonth() + 1 }/${ date.getDate() }`;

                return moment(dateToString).format('jYYYY/jMM/jDD');
            }
        }
    }
}
