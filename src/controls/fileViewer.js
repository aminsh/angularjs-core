export function fileViewer() {
    return {
        restrict: 'E',
        templateUrl: 'dsCore/controls/fileViewer.html',
        scope: {
            fileList: '=',
            fileName: '@',
            editable: '=',
            fileAdded: '&',
            fileRemoved: '&'
        },
        link(scope, elements, attrs) {
            const imageGroups = {
                image: [ 'JPG', 'PNG', 'JPEG' ],
                text: [ 'TXT', 'XLS', 'XLSX', 'DOC' ],
                pdf: [ 'PDF' ]
            };

            function getCategory(ext) {
                let cat = '';
                Object.keys(imageGroups).forEach(key => {
                    if (imageGroups[ key ].includes(ext))
                        cat = key;
                });

                return cat;
            }

            function mapper(file) {
                const fileName = typeof file === 'string' ? file : file.fileName;

                return {
                    name: fileName,
                    extension: fileName.split('.').pop().toUpperCase(),
                    category: getCategory(fileName.split('.').pop().toUpperCase())
                }
            }

            scope.files = ( scope.fileList || [ scope.fileName ] ).map(mapper);

            scope.onImageUploaded = (fileName) => {
                scope.files.push(mapper(fileName));
                scope.fileAdded({ $fileName: fileName });
                scope.uploader.removeAllFiles();
            };

            scope.remove = file => {
                scope.files.asEnumerable().remove(file);
                scope.fileRemoved({ $fileName: file.name });
            };

            scope.uploader = {};
        }
    }
}
