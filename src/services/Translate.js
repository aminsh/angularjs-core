/* @ngInject */
export function Translate($filter) {
    return key => $filter('translate')(key);
}
