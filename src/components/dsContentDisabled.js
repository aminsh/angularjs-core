export function dsContentDisabled() {
    return {
        restrict: 'A',
        link: (scope, element, attrs) => {
            const contentDisabled = attrs['dsContentDisabled'];

            scope.$watch(contentDisabled, (newValue) => {
                if (newValue)
                    $(element).addClass('ds-content-disabled');
                else
                    $(element).removeClass('ds-content-disabled');
            });
        }
    };
}
