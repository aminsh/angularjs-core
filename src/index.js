import angular from 'angular';
import 'angular-material';
import 'angular-cookies';
import 'angular-material-persian-datepicker';
import 'angular-translate';
import 'angular-dynamic-number';
import _ from 'lodash';
import { dsDataTable } from './datatable';
import { datepicker, combobox, dsNumber, blurEnter, fileViewer, fileUploader } from './controls';
import { HttpRequest, Promise, Translate, DataService } from './services';

_.templateSettings.interpolate = /#([\s\S]+?)#/g;

angular.module('ds-core', [ 'ngMaterial', 'angular-material-persian-datepicker', 'ngCookies', 'pascalprecht.translate', 'dynamicNumber' ])
    .config((dynamicNumberStrategyProvider) => {
        dynamicNumberStrategyProvider.addStrategy('default', {
            numInt: 100,
            numFract: 2,
            numSep: '.',
            numPos: true,
            numNeg: true,
            numRound: 'round',
            numThousand: true
        });
    })
    .directive('dsDatatable', dsDataTable)

    .directive('dsDatepicker', datepicker)
    .directive('dsCombobox', combobox)
    .directive('blueEnter', blurEnter)
    .directive('dsNumber', dsNumber)
    .directive('dsFileViewer', fileViewer)
    .directive('dsFileUploader', fileUploader)

    .service('httpRequest', HttpRequest)
    .service('promise', Promise)
    .service('dataService', DataService)
    .factory('translate', Translate)
;

export const CoreModule = 'ds-core';
export * from './utils';
