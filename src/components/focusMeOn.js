export function focusMeOn($timeout) {
    return {
        restrict: 'A',
        link(scope, element, attrs) {
            if (angular.isDefined(attrs.focusMeOn)) {
                scope.$on(attrs.focusMeOn, () => {
                    $timeout(() => $(element).focus(), 500);
                });
            }
        }
    }
}
