export function resolveJQuery() {
    window.$ = window.jQuery = window.JQuery = require('jquery');
    window.moment = require('moment-jalaali');
}
