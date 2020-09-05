export function paging() {
    return {
        restrict: 'E',
        priority: 200,
        templateUrl: 'dsCore/paging/paging-template.html',
        replace: true,
        scope: {
            'setPage': '&',
            'total': '=',
            'options': '='
        },
        link: (scope, element, attrs) => {
            scope.currentPage = 1;
            scope.pageSizes = [ 5, 10, 20, 50, 100 ];
            scope.pageSize = scope.options.pageSize || 20;
            scope.totalPages = 0;
            scope.canShowPageSizeSelector = scope.options.hasOwnProperty('pagingEnabled')
                ? scope.options.pagingEnabled
                : true;

            scope.change = () => {
                let $page = {
                    page: scope.currentPage,
                    skip: (scope.currentPage - 1) * (scope.pageSize ? scope.pageSize : 20),
                    take: (scope.pageSize ? scope.pageSize : 20)
                };
                scope.setPage({ $page });
            };

            scope.options.reset = () => {
                scope.currentPage = 1;
                scope.change();
            };

            scope.options.refresh = scope.change;

            scope.$watch('pageSize', () => scope.options.reset());

            scope.change();

            scope.first = () => {
                scope.currentPage = 1;
                scope.change();
            };

            scope.previous = () => {
                --scope.currentPage;
                scope.change();
            };

            scope.next = () => {
                ++scope.currentPage;
                scope.change();
            };

            scope.last = () => {
                scope.currentPage = scope.totalPages;
                scope.change();
            };

            scope.$watch('total', changeTotalPages);
            scope.$watch('pageSize', changeTotalPages);

            function changeTotalPages() {
                scope.totalPages = Math.ceil(scope.total / scope.pageSize);
            }
        }
    }
}
