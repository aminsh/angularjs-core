import template from './dsSidebar.html';

/**
 * @ngdoc directive
 * @name CoreModule.directive:dsPreImageLoader
 * @restrict E
 * @scope
 * @param {Array} items [{label: 'home', mdIcon: 'md-home', state: 'dashboard'}]
 *
 * @description
 *
 *
 * @example
 *
 */

/* @ngInject */
export function dsSidebar($rootScope, $state, $timeout, $mdSidenav, dsEnvironment) {
    return {
        restrict: 'E',
        scope: {
            items: '='
        },
        template,
        link: (scope, element, attrs, state) => {
            require('metismenu');
            scope.localItems = scope.items.filter(item => dsEnvironment.env === 'development' ? true : !item.underDevelop);

            scope.hasChildren = item => {
                if (item.children) {
                    return item.children.some(item => {
                        return $state.current.name === item.state || $state.current.name.includes(item.state);
                    });
                } else {
                    return false;
                }
            };

            let sideMenu = $(element).find('#side-menu'),
                mdSideMenu = $(element).find('#md-side-menu'),
                sideMenuWrapper = $(element);

            function buildMenu() {
                $timeout(() => {
                    sideMenu.metisMenu();
                    mdSideMenu.metisMenu();
                    sideMenu.css('display', 'block');
                    mdSideMenu.css('display', 'block');
                });
            }

            buildMenu();

            scope.$on('sidebar:rebuild', () => {
                buildMenu();
            });

            scope.isOpen = true;

            $rootScope.$on('sidebar:toggle', () => {
                scope.isOpen = !scope.isOpen;
                sideMenuWrapper.toggleClass('hidden-menu');
                scope.toggleMdSidebar();
                $('.so-toggle-sidebar-btn').toggleClass('so-menu-btn-active');
            });

            scope.toggleMdSidebar = () => {
                if ($(document).width() <= 960) {
                    $mdSidenav('sidebar').toggle();
                }
            };
        }
    };
}
