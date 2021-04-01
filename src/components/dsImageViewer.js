import Viewer from 'viewerjs';

/**
 * @ngdoc directive
 * @name CoreModule.directive:dsImageViewer
 * @restrict A
 *
 * @description
 * When you this directive on "Image Tag" , this can be clickable and with click on this show the image src on Image viewer
 *
 * @example
 * <img src="./image.png" ds-image-viewer>
 */

export function dsImageViewer() {
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
