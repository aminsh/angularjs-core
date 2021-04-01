    /**
 * @ngdoc directive
 * @name CoreModule.directive:dsFocusMeOn
 * @restrict A
 *
 * @description
 *  if event name which declare of this , raised then input focus
 *
 * @example
     * <input name="title" ng-model="$ctrl.title" ds-focus-me-on="focusTitleEvent">
 */

/*@ngInject*/
export function dsFocusMeOn($timeout) {
    return {
        restrict: 'A',
        link(scope, element, attrs) {
            if (angular.isDefined(attrs['dsFocusMeOn'])) {
                scope.$on(attrs['dsFocusMeOn'], () => {
                    $timeout(() => $(element).focus(), 500);
                });
            }
        }
    }
}
