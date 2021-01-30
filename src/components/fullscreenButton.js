export function fullscreenButton() {
    return {
        restrict: 'E',
        replace: true,
        template: `<i>
                    <md-button hide-xs hide-sm class="md-icon-button" ng-click="change()">
                        <md-tooltip md-direction="bottom">{{fullscreen ? 'exit_fullscreen' : 'fullscreen'|translate}}</md-tooltip>
                        <md-icon ng-show="!fullscreen" md-svg-src="md-fullscreen" aria-label="fullscreen dialog"></md-icon>
                        <md-icon ng-show="fullscreen" md-svg-src="md-fullscreen-exit" aria-label="fullscreen-exit dialog"></md-icon>
                    </md-button>
                   </i>`,
        scope: true,
        link: function (scope, element, attrs) {
            let $mdDialogElement = $(element).parents('md-dialog');
            scope.fullscreen = false;
            scope.change = () => {
                $mdDialogElement.toggleClass('fullscreen-dialog');
                scope.fullscreen = $mdDialogElement.hasClass('fullscreen-dialog');
            };
        }
    };
}
