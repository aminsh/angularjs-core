export function list() {
    return {
        restrict: 'E',
        template: '<ul class="list-group clear-list bordered-list m-t white-bg no-padding" ng-transclude></ul>',
        transclude: true,
        scope: false,
        link: function (scope, element, attrs) {
            if (attrs.hasOwnProperty('borderedBottomList')) {
                const $elem = $(element).find('ul');
                $elem.removeClass('bordered-list');
                $elem.addClass('bordered-bottom-list');
            }
        }
    };
}

export function listItem() {
    return {
        restrict: 'E',
        template: '<li class="list-group-item no-padding no-radius" layout="row" ng-transclude style="min-height: 45px"></li>',
        transclude: true,
        replace: true,
        scope: false,
        link: function (scope, element, attrs) {
        }
    };
}
