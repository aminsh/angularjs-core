import '../dist/storm.ui-core';
import * as angular from 'angular';
angular.module('app', ['ds-core'])
    .controller('ctrl', function ($scope) {
    $scope.title = 'Amin';
});
