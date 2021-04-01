import Dropzone from 'dropzone';
import template from './dsFileUploader.html';

/**
 * @ngdoc directive
 * @name CoreModule.directive:dsFileUploader
 * @restrict E
 * @require ngModel
 * @scope
 * @param {Function} uploaded on file uploaded
 * @param {Function} acceptedFiles allowed file extensions
 * @param {Number} maxFileSize the Maximum of file size
 *
 * @description
 *
 *
 * @example
 */

/* @ngInject */
export function dsFileUploader(dsTranslate, dsEnvironment) {
    return {
        restrict: 'E',
        template,
        replace: true,
        scope: {
            before: '&',
            uploaded: '&',
            acceptedFiles: '@',
            maxFileSize: '@',
            uploaderAction: '=',
            isSingular: '<'
        },
        link: (scope, element, attrs) => {
            const defaultAcceptedFiles = 'image/*,application/pdf,.xlsx,docx';
            let maxFileSize = parseInt(attrs.maxFileSize);

            if (!(maxFileSize && !isNaN(maxFileSize)))
                maxFileSize = 2;

            let config = {
                    url: dsEnvironment.UPLOAD_URL || '/upload',
                    method: 'post',
                    maxFilesize: maxFileSize,
                    acceptedFiles: attrs.acceptedFiles || defaultAcceptedFiles,
                    clickable: '#upload',
                    addRemoveLinks: true,
                    dictRemoveFile: dsTranslate('remove'),
                    headers: { Authorization: dsEnvironment.USER_KEY }
                },
                dropzone = new Dropzone(element[0], config);

            dropzone.on('success', function (file, response) {
                scope.uploaded({ fileName: response.fullName, originalFileName: response.originalName });
                scope.$apply();
            });

            if (scope.isSingular) {
                dropzone.on("addedfile", function () {
                    if (dropzone.files[1] != null) {
                        dropzone.removeFile(this.files[0]);
                    }
                });
            }

            dropzone.on('error', function (error) {
                console.log(error);
            });

            if (scope.uploaderAction)
                scope.uploaderAction.removeAllFiles = () => dropzone.removeAllFiles();
        }
    };
}

