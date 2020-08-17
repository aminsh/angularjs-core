export function datepicker() {
    return {
        require: 'ngModel',
        restrict: 'E',
        templateUrl: 'dsCore/controls/datepicker.html',
        scope: {
            ngModel: '=',
            ngDisabled: '=',
            label: '@'
        },
        link: (scope, element, attrs, ngModel) => {
            $(element).addClass('ds-datepicker');

            scope.localDate = null;

            scope.$watch(
                () => ngModel.$modelValue,
                newValue => {
                    if (!newValue) {
                        scope.localDate = null;
                        return;
                    }
                    scope.localDate = moment(newValue, 'jYYYY/jMM/jDD')._d;
                }
            );

            scope.$watch('localDate', newValue => {
                    if (!newValue)
                        return;
                    ngModel.$setViewValue(getDate(scope.localDate))
                }
            );

            function getDate(date) {

                if (typeof date === 'string')
                    date = new Date(date);

                let dateToString = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

                return moment(dateToString).format('jYYYY/jMM/jDD');
            }
        }
    }
}