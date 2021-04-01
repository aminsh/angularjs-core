import angular from 'angular';
import 'angular-material';
import 'angular-cookies';
import 'moment-jalaali'
import 'angular-material-persian-datepicker';
import 'angular-translate';
import 'angular-dynamic-number';
import _ from 'lodash';
import { Index as Providers } from "./providers";
import { Index as Components } from "./components";
import { Index as Services } from "./services";
import { Index as Report } from "./report";
import { Index as Configs } from "./configs";
import { Index as DataTable } from './datatable';

_.templateSettings.interpolate = /#([\s\S]+?)#/g;

const dsCoreModule = angular.module('ds-core',
    [ 'ngMaterial', 'angular-material-persian-datepicker', 'ngCookies', 'pascalprecht.translate', 'dynamicNumber', 'ui.router' ]);
[
    Configs,
    Providers,
    Components,
    Services,
    Report,
    DataTable
]
    .forEach(c => c.configure(dsCoreModule));

export const CoreModule = 'ds-core';
export * from './utils';
export { DsDialog, registerDialog, DialogProvider } from './services';
export { resolveJQuery } from './jquery.global.resolve';
