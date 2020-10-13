import angular from 'angular';
import 'angular-material';
import 'angular-cookies';
import 'moment-jalaali'
import 'angular-material-persian-datepicker';
import 'angular-translate';
import 'angular-dynamic-number';
import 'angular-ui-router';
import _ from 'lodash';
import { dsDataTable } from './datatable';
import {
    datepicker,
    combobox,
    dsNumber,
    dsNumberConfig,
    blurEnter,
    fileViewer,
    fileUploader,
    NotifyService, NotifyController
} from './controls';
import {
    HttpRequest,
    Promise,
    DataService,
    DialogService,
    Translate,
    NavigateService,
    Logger,
    Confirm,
    FormService
} from './services';
import { paging } from './paging';
import { environmentProvider } from "./providers/environmentProvider";
import { mdConfig } from "./configs/mdConfig";

_.templateSettings.interpolate = /#([\s\S]+?)#/g;

angular.module('ds-core', [ 'ngMaterial', 'angular-material-persian-datepicker', 'ngCookies', 'pascalprecht.translate', 'dynamicNumber','ui.router' ])
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

    .controller('notifyController', NotifyController)

    .service('notify', NotifyService)
    .service('httpRequest', HttpRequest)
    .service('promise', Promise)
    .service('dataService', DataService)
    .service('dsDialog', DialogService)
    .factory('translate', Translate)
    .provider('environment', environmentProvider)
    .service('formService', FormService)
    .factory('navigate', NavigateService)
    .service('logger', Logger)
    .factory('confirm', Confirm)
;

export const CoreModule = 'ds-core';
export * from './utils';
export { DsDialog, registerDialog, DialogProvider } from './services';
