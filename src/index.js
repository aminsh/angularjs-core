import angular from 'angular';
import 'angular-material';
import 'angular-cookies';
import 'moment-jalaali'
import 'angular-material-persian-datepicker';
import 'angular-translate';
import 'angular-dynamic-number';
import _ from 'lodash';
import { dsDataTable } from './datatable';
import { sidebar } from "./sidebar/sidebar";
import { preImageLoader, list, listItem } from "./widget";
import { ComponentsConfiguration } from "./components";
import { ReportConfiguration } from "./report";
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
    FormService, ServicesConfiguration
} from './services';
import { paging } from './paging';
import { environmentProvider } from "./providers/environmentProvider";
import { mdConfig } from "./configs/mdConfig";

_.templateSettings.interpolate = /#([\s\S]+?)#/g;

const dsCoreModule = angular.module('ds-core',
    [ 'ngMaterial', 'angular-material-persian-datepicker', 'ngCookies', 'pascalprecht.translate', 'dynamicNumber', 'ui.router' ]);
dsCoreModule
    .config(dsNumberConfig)
    .config(mdConfig)
    .directive('dsSidebar', sidebar)
    .directive('dsDatatable', dsDataTable)
    .directive('dsDatepicker', datepicker)
    .directive('dsCombobox', combobox)
    .directive('blueEnter', blurEnter)
    .directive('dsNumber', dsNumber)
    .directive('dsFileViewer', fileViewer)
    .directive('dsFileUploader', fileUploader)
    .directive('dsPaging', paging)
    .directive('dsPreImageLoader', preImageLoader)
    .directive('dsList', list)
    .directive('dsListItem', listItem)
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

ComponentsConfiguration.configure(dsCoreModule);
ReportConfiguration.configure(dsCoreModule);
ServicesConfiguration.configure(dsCoreModule);


export const CoreModule = 'ds-core';
export * from './utils';
export { DsDialog, registerDialog, DialogProvider } from './services';
