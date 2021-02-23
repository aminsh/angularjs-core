import Viewer from 'viewerjs';

export function imageViewer() {
    return {
        restrict: 'A',
        link(scope, elements, attrs) {
            $(elements[0]).addClass('pointer');

            const viewer = new Viewer(elements[0], {
                inline: false,
                navbar: false,
                viewed() {
                    viewer.zoomTo(1);
                },
            });
        }
    }
}
