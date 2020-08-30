/* @ngInject */
export function dsNumber() {
    return {
        restrict: 'E',
        template: '<input blur-enter awnum="default" autocomplete="off"/> ',
        replace: true
    }
}

/* @ngInject */
export function blurEnter($window) {
    return {
        restrict: 'A',
        link: function ($scope, elem, attrs) {

            $window.setEnterBlur = element => element.bind('keydown', handler);

            elem.bind('keydown', handler);

            function handler(e) {
                let code = e.keyCode || e.which;
                if (code === 13) {
                    e.preventDefault();
                    const nextInput = findNext(elem);
                    if (nextInput) {
                        nextInput.focus();
                    } else {
                        elem.blur();
                    }
                }
            }
        }
    }
}

function findNext(elem) {
    if (elem.next('input').length > 0) {
        return elem.next('input');
    } else {
        if (elem.parent().next().length > 0) {
            if (elem.parent().next().children('input').length > 0) {
                return elem.parent().next().children('input').first();
            } else {
                return findNext(elem.parent().next().children().first())
            }
        } else {
            return null;
        }

    }
}
