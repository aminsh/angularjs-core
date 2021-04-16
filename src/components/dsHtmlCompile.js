/**
 * @ngdoc directive
 * @name CoreModule.directive:dsHtmlCompile
 * @restrict A
 *
 * @description
 *  For dynamic compile html template
 *
 * @example
 */

/*@ngInject*/
export function dsHtmlCompile($compile) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(attrs['dsHtmlCompile'], function (newValue, oldValue) {
                if (!newValue)
                    return element.empty();
                element.html(newValue.replaceAll('no-compile-', ''));
                $compile(element.contents())(scope);
            });
        }
    }
}
