import Dropzone from 'dropzone';

/* @ngInject */
export function fileUploader(translate, environment) {
    return {
        restrict: 'E',
        templateUrl: 'dsCore/controls/fileUploader.html',
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

            if(!(maxFileSize && !isNaN(maxFileSize)))
                maxFileSize = 2;

            let config = {
                    url: environment.UPLOAD_URL || '/upload',
                    method: 'post',
                    maxFilesize: maxFileSize,
                    acceptedFiles: attrs.acceptedFiles || defaultAcceptedFiles,
                    clickable: '#upload',
                    addRemoveLinks: true,
                    dictRemoveFile: translate('remove'),
                },
                dropzone = new Dropzone(element[0], config);

            dropzone.on('success', function (file, response) {
                scope.uploaded({fileName: response.fullName, originalFileName: response.originalName});
                scope.$apply();
            });

            if(scope.isSingular) {
                dropzone.on("addedfile", function() {
                    if (dropzone.files[1]!=null){
                        dropzone.removeFile(this.files[0]);
                    }
                });
            }

            dropzone.on('error', function (error) {
                console.log(error);
            });

            if(scope.uploaderAction)
                scope.uploaderAction.removeAllFiles = () => dropzone.removeAllFiles();
        }
    };
}

