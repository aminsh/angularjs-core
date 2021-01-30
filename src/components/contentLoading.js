export function contentLoading() {
    return {
        restrict: 'A',
        compile: (tElement, tAttrs) => {
            const $element = $(tElement);

            $element.addClass('ibox-content');
            $element.addClass('ds-content-loading');

            let size = 50;

            let loadingSize = tAttrs['loadingSize'];

            if(loadingSize === 'sm')
                size = 20;

            if(loadingSize === 'lg')
                size = 50;

            if(loadingSize === 'md')
                size = 40;

            $element.prepend(`<div class="sk-spinner">
                               <div layout="row" layout-sm="column" layout-align="space-around" layout-align="center center">
                                    <md-progress-circular md-mode="indeterminate" md-diameter="${size}"></md-progress-circular>
                                </div>
                            </div>`);

            return function link(scope, element, attrs) {

                let loadingName = attrs['dsContentLoading'];

                scope.$watch(loadingName, (newValue)=> {
                    if(newValue)
                        $(element).addClass('sk-loading');
                    else
                        $(element).removeClass('sk-loading');
                });
            }

        }
    }
}
