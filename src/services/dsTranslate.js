/* @ngInject */
export function dsTranslate($filter) {
    return key => $filter('translate')(key);
}
