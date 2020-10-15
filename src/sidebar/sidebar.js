/* @ngInject */
export function sidebar($rootScope, $state, $timeout, $mdSidenav, environment) {
    return {
        restrict: 'E',
        scope: {
            items: '='
        },
        templateUrl: 'dsCore/sidebar/sidebar.html',
        link: (scope, element, attrs, state) => {
            require('metismenu');
            scope.localItems = scope.items.filter(item => environment.env === 'development' ? true : !item.underDevelop);

            scope.hasChildren = (item) => {
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
