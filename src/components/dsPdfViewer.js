import { PDFObject } from './PDFObject';
import template from './dsPdfViewer.html';

export function dsPdfViewerComponent() {
    return {
        restrict: 'E',
        template: '<div id="pdf-viewer-container" style="height: 100rem"></div>',
        link(scope, elements, attrs) {
            PDFObject.embed(attrs.url, "#pdf-viewer-container");
        }
    }
}

/*@ngInject*/
class dsPdfViewerController {
    constructor(data, $timeout) {
        this.canShow = false;

        $timeout(()=> {
            this.url = data.url;
            this.canShow = true;
        }, 500);
    }
}

/*@ngInject*/
export function dsPdfViewer(dsDialog) {
    return dsDialog.createForService({
        controller: dsPdfViewerController,
        controllerAs: 'model',
        template
    });
}
