/* @ngInject */
export function fileViewer(environment, dsPdfViewer, $templateCache) {
    return {
        restrict: 'E',
        scope: {
            fileList: '=',
            fileName: '@',
            editable: '=',
            fileAdded: '&',
            fileRemoved: '&'
        },
        template: function (element, attrs) {
            attrs['$userTemplate'] = element.clone();
            return $templateCache.get('dsCore/controls/fileViewer.html')
        },
        compile(tElement, tAttrs) {
            const $element = $(tElement);
            const $userTemplate = $(tAttrs.$userTemplate);
            const $container = $element.find('#container');
            if ($userTemplate.length > 0) {
                const $dsFileTemplate = $userTemplate.find('ds-file-template');

                if ($dsFileTemplate.length > 0) {
                    $container.html($dsFileTemplate.html());
                }
            }
            return function (scope, elements, attrs) {
                const imageGroups = {
                    image: [ 'JPG', 'PNG', 'JPEG' ],
                    text: [ 'TXT', 'XLS', 'XLSX', 'DOC' ],
                    pdf: [ 'PDF' ]
                };

                function getCategory(ext) {
                    let cat = '';
                    Object.keys(imageGroups).forEach(key => {
                        if (imageGroups[key].includes(ext))
                            cat = key;
                    });

                    return cat;
                }

                function mapper(file) {
                    const fileName = typeof file === 'string' ? file : file.fileName;

                    return {
                        filename: fileName.startsWith('http') ? fileName : `${ environment.ROOT_URL }/${ fileName }`,
                        name: file.name,
                        extension: fileName.split('.').pop().toUpperCase(),
                        category: getCategory(fileName.split('.').pop().toUpperCase()),
                        isSelected: false
                    }
                }

                scope.files = (scope.fileList || [ scope.fileName ]).map(mapper);

                scope.onImageUploaded = (fileName, originalFileName) => {
                    const $file = { fileName, name: originalFileName };
                    scope.files.push(mapper($file));
                    scope.fileAdded({ $file });
                    scope.uploader.removeAllFiles();
                };

                scope.remove = file => {
                    scope.files.remove(file);
                    scope.fileRemoved({ $fileName: file.name });
                };

                scope.uploader = {};
                scope.getFiles = () => scope.files;
                scope.showPdf = url => {
                    dsPdfViewer.show({ url });
                };
            }
        },

    }
}
