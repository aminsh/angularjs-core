import { PDFObject } from './PDFObject';

export function dsPdfViewerComponent() {
    return {
        restrict: 'E',
        template: '<div id="pdf-viewer-container" style="height: 100rem"></div>',
        link(scope, elements, attrs) {
            PDFObject.embed(attrs.url, "#pdf-viewer-container");
        }
    }
}

export class dsPdfViewerController {
    constructor(data, $timeout) {
        this.canShow = false;

        $timeout(()=> {
            this.url = data.url;
            this.canShow = true;
        }, 500);
    }
}

export function dsPdfViewer(dsDialog) {
    return dsDialog.create({
        controller: 'dsPdfViewerController',
        controllerAs: 'model',
        templateUrl: 'partials/directives/dsPdfViewer.html'
    });
}
