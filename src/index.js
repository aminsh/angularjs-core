import angular from 'angular';
import 'angular-material';
import 'angular-cookies';
import 'angular-material-persian-datepicker';
import 'angular-translate';
import 'angular-dynamic-number';
import _ from 'lodash';
import { dsDataTable } from './datatable';
import { datepicker, combobox, dsNumber, dsNumberConfig, blurEnter, fileViewer, fileUploader } from './controls';
import { HttpRequest, Promise, DataService, DialogService, Translate } from './services';
import { paging } from './paging';
import { environmentProvider } from "./providers/environmentProvider";
import { mdConfig } from "./configs/mdConfig";

_.templateSettings.interpolate = /#([\s\S]+?)#/g;

angular.module('ds-core', [ 'ngMaterial', 'angular-material-persian-datepicker', 'ngCookies', 'pascalprecht.translate', 'dynamicNumber' ])
    .config(dsNumberConfig)
    .config(mdConfig)
    .directive('dsDatatable', dsDataTable)

    .directive('dsDatepicker', datepicker)
    .directive('dsCombobox', combobox)
    .directive('blueEnter', blurEnter)
    .directive('dsNumber', dsNumber)
    .directive('dsFileViewer', fileViewer)
    .directive('dsFileUploader', fileUploader)
    .directive('dsPaging', paging)

    .service('httpRequest', HttpRequest)
    .service('promise', Promise)
    .service('dataService', DataService)
    .service('dsDialog', DialogService)
    .factory('translate', Translate)
    .provider('environment', environmentProvider)
;

export const CoreModule = 'ds-core';
export * from './utils';
export { DsDialog, registerDialog, DialogProvider } from './services';
