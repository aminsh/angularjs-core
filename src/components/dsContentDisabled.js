export function dsContentDisabled() {
    return {
        restrict: 'A',
        link: (scope, element, attrs) => {
            const contentDisabled = attrs['dsContentDisabled'];

            scope.$watch(contentDisabled, (newValue) => {
                if (newValue)
                    $(element).addClass('ds-disabled-content');
                else
                    $(element).removeClass('ds-disabled-content');
            });
        }
    };
}
