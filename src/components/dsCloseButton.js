/**
 * @ngdoc directive
 * @name CoreModule.directive:dsCloseButton
 * @restrict E
 * @scope
 * @param {Function} onClosing On closing dialog
 *
 * @description
 *
 *
 * @example
 */

/*@ngInject*/
export function dsCloseButton($mdDialog) {
    return {
        restrict: 'E',
        template: `<md-button class="md-icon-button" ng-click="cancel()" style="margin-left: 0">
                        <md-icon md-svg-src="md-close" aria-label="Close dialog"></md-icon>
                    </md-button>`,
        scope: {
            onClosing: '&'
        },
        link: function (scope, element, attrs) {

            scope.cancel = () => {
                scope.onClosing();
                $mdDialog.cancel()
            };
        }
    };
}
