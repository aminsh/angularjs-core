/**
 * @ngdoc directive
 * @name CoreModule.directive:dsPreImageLoader
 * @restrict A
 * @param {String} defaultImage before image loaded
 * @param {String} fallbackImage when image fail
 *
 * @description
 *
 *
 * @example
 * <img ng-src="{{ user.image }}" alt="{{ user.name }}"
        ds-pre-image-loader default-image="user.png" fallback-image="user.png"/>
 */
export function dsPreImageLoader() {
    return {
        restrict: 'A',
        terminal: true,
        priority: 100,
        link: (scope, element, attrs) => {
            attrs.$observe('ngSrc', () => {
                const url = escapeUrlProtocol(attrs.ngSrc),
                    defaultImage = attrs.defaultImage,
                    fallbackImage = attrs.fallbackImage;

                attrs.$set('src', defaultImage);

                if(!attrs.ngSrc)
                    return;

                perLoader(url)
                    .then(() => attrs.$set('src', url))
                    .catch(() => {
                        if (fallbackImage !== undefined)
                            attrs.$set('src', fallbackImage);
                    });
            });
        },
    };
}

function perLoader(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();

        angular.element(image)
            .bind('load', () => resolve())
            .bind('error', () => reject())
            .attr('src', url);
    });
}

function escapeUrlProtocol(url) {
    return url.replace(/^https?:\/\//i, '//');
}
