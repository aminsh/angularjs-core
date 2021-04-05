import '../dist/storm.ui-core';
import * as angular from 'angular';

interface ICtrlScope { 
    title: string;
}

angular.module('app', ['ds-core'])
    .controller('ctrl', function ($scope: ICtrlScope) {
        $scope.title = 'AminSh';
    });

 
