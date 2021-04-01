import template from './dsFileViewer.html';

/**
 * @ngdoc directive
 * @name CoreModule.directive:dsFileViewer
 * @restrict E
 * @require ngModel
 * @scope
 * @param {Array} fileList list of file for display
 * @param {String} fileName A name of file for display
 * @param {Boolean} editable if true you can add or remove file
 * @param {Function} fileAdded of file added event
 * @param {Function} fileRemoved of file removed event
 *
 * @description
 *
 *
 * @example
 */

/* @ngInject */
export function dsFileViewer(dsEnvironment, dsPdfViewer) {
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
            return template;
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
                        filename: fileName.startsWith('http') ? fileName : `${ dsEnvironment.ROOT_URL }/${ fileName }`,
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
