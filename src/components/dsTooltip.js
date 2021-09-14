/* @ngInject */
export function dsTooltip() {
    return {
        restrict: 'A',
        compile(tElement, tAttrs) {
            const defaultDirection = 'bottom';
            const mdTooltip =
                `<md-tooltip md-direction="${tAttrs['dsTooltipDirection'] || defaultDirection }">${tAttrs['dsTooltip']}</md-tooltip>`;
            tElement.append(mdTooltip);
            return function link(scope, element, attrs) {

            }
        }
    }
}
