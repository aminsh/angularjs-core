'use strict';

var angular = require('angular');
var _$1 = require('lodash');
var Enumerable = require('linq');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var angular__default = /*#__PURE__*/_interopDefaultLegacy(angular);
var ___default = /*#__PURE__*/_interopDefaultLegacy(_$1);
var Enumerable__default = /*#__PURE__*/_interopDefaultLegacy(Enumerable);

const default_validator_messages = {
  'required': 'This field is required',
  'md-require-match': 'Please select an existing item',
  'notShouldBeZero': 'This field should have a value not equal to zero'
};
function getValidators(column_attrs, column_validators) {
  let validators = Object.assign({}, default_validator_messages, column_validators);
  const validators_on_input = Object.keys(column_attrs).map(attr => attr === 'md-require-match' ? 'md-require-match' : camelize(attr)).filter(attr => Object.keys(validators).includes(attr)).map(validator => ({
    name: validator,
    message: validators[validator]
  }));
  return validators_on_input;
}
function getAttrsValidatorShow(name) {
  return {
    'uib-tooltip-template': `'${name}_validator_template'`,
    'tooltip-enable': `form['form-'+ $index].${name}.$invalid && form['form-'+ $index].${name}.$dirty`,
    'tooltip-class': 'error-tooltip',
    'tooltip-placement': "bottom"
  };
}

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    return index == 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '').replaceAll('-', '');
}

const constants = {
  HEADER: 'header',
  HEADER_TEMPLATE: 'column-header-template',
  MODEL: 'model',
  NAME: 'name',
  ALIGN: 'align',
  HEADER_ALIGN: 'header-align',
  WIDTH: 'width',
  REQUIRED_ATTRIBUTE: '[required]',
  REPEAT: 'repeat',
  IF: 'if',
  NG_CLASS: 'ng-class',
  EDITOR_TYPE: 'editor',
  EDITOR: 'column-editor',
  EDITOR_TEMPLATE: 'column-editor-template',
  SELECT_OPTION_REPEAT_EXPRESSION: 'repeat-expression',
  SELECT_OPTION_VALUE: 'value',
  SELECT_OPTION_DISPLAY: 'display',
  SELECT_SEARCHABLE: 'searchable',
  SELECT_IMAGE_SRC: 'image-src',
  FOOTER: 'footer',
  NO_COMPILE: 'no-compile-'
};
function columnsParser($columns) {
  let columns = [];
  $columns.each(function (i, item) {
    let column = columnParser(i, $(item));
    columns.push(column);
  });
  return columns;
}

function columnParser(i, $item) {
  let column = {
    label: $item.attr(constants.HEADER),
    align: $item.attr(constants.ALIGN),
    header_align: $item.attr(constants.HEADER_ALIGN),
    width: $item.attr(constants.WIDTH),
    header_template: '',
    ngIf: $item.attr(constants.IF),
    ngModel: $item.attr(constants.MODEL),
    name: $item.attr(constants.NAME),
    footer: $item.attr(constants.FOOTER)
  };

  if ($item.find(constants.HEADER_TEMPLATE).length > 0) {
    column.header_template = replaceTemplate($item.find(constants.HEADER_TEMPLATE).html());
  }

  column.editor = editorParser($item);
  return column;
}

function editorParser($item) {
  let $editor = $item.find(constants.EDITOR);
  let editor = {
    element: $editor.attr(constants.EDITOR_TYPE)
  };
  editor = Object.assign({}, editor, getAttrs($editor), getAttrsValidatorShow($item.attr('name')));
  if ($editor.is(constants.REQUIRED_ATTRIBUTE)) editor.required = true;
  if (editor.element === 'combo' && editor.required) editor['md-require-match'] = true;

  if (editor.element === 'select') {
    editor.options = {
      repeatExpression: $editor.attr(constants.SELECT_OPTION_REPEAT_EXPRESSION),
      value: $editor.attr(constants.SELECT_OPTION_VALUE),
      display: $editor.attr(constants.SELECT_OPTION_DISPLAY),
      searchable: hasAttr($editor, constants.SELECT_SEARCHABLE),
      imageSrc: $editor.attr(constants.SELECT_IMAGE_SRC)
    };
  }

  if (editor.element === 'switch') ;

  if (editor.element === 'custom') {
    let $editor_template = $editor.find(constants.EDITOR_TEMPLATE);
    editor.template_validators = customTemplateValidatorParser($editor_template);
    editor.template = replaceTemplate($editor_template.html());
  } else editor.validators = getValidators(editor, validatorParser($item));

  return editor.element ? editor : null;
}

function hasAttr($tag, attrName) {
  let attr = $tag.attr(attrName);
  return typeof attr !== typeof undefined && attr !== false;
}

function validatorParser($item) {
  let validators = {};
  if ($item.find('validators').length === 0) return;
  $item.find('validators').find('validator').each(function (i, item) {
    let attrs = getAttrs($(item));
    validators[attrs.name] = attrs.message;
  });
  return validators;
}

function customTemplateValidatorParser($template) {
  let validators = [];
  $template.find('[ds-input]').each(function (i, item) {
    let $item = $(item),
        name = $item.attr('name'),
        input_attr = getAttrs($item);
    let input_validators = getValidators(input_attr);
    validators.push({
      name,
      validators: input_validators
    });
    let attr_validator_show = getAttrsValidatorShow(name);
    Object.keys(attr_validator_show).forEach(key => {
      $item.attr(key, attr_validator_show[key]);
    });
  });
  return validators;
}

function getAttrs($element, item) {
  item = item || {
    'ng-focus': `setCurrent(item,'${$element.attr('name')}')`
  };
  $element.each(function () {
    $.each(this.attributes, function () {
      // this.attributes is not a plain object, but an array
      // of attribute nodes, which contain both the name and value
      if (this.specified) {
        item[replaceTemplate(this.name)] = this.value;
      }
    });
  });
  return item;
}
function replaceTemplate(template) {
  return template.replaceAll(constants.REPEAT, 'ng-repeat').replaceAll(constants.IF, 'ng-if').replaceAll(constants.NO_COMPILE, '');
}

function footerParser($footers) {
  let footers = [];
  $footers.each(function (i, footer) {
    const $footer = $(footer);
    footers.push({
      items: rowParser($footer),
      attrs: getAttrs($footer, {})
    });
  });
  return footers;
}

function rowParser($footer) {
  let items = [];
  $footer.find('footer-item').each(function (i, item) {
    items.push(cellParser($(item)));
  });
  return items;
}

function cellParser($item) {
  let item = {
    column_count: $item.attr('column-count') || 1,
    row_count: $item.attr('row-count') || 1,
    template: $item.html(),
    attrs: getAttrs($item)
  };

  if (item.attrs.hasOwnProperty('no-border')) {
    item.attrs.class = (item.attrs.class || '') + ' ds-dataTable-footer-cell-no-border';
    delete item.attrs['no-border'];
  }

  if (item.attrs.hasOwnProperty('bordered')) {
    item.attrs.class = (item.attrs.class || '') + ' ds-dataTable-footer-cell-bordered';
    delete item.attrs['bordered'];
  }

  delete item.attrs['column-count'];
  delete item.attrs['ng-focus'];
  delete item.attrs.template;
  return item;
}

const keyboard = {
  ENTER: 13,
  SHIFT: 16,
  ARROW_RIGHT: 39,
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_DOWN: 40,
  DELETE: 46,
  INSERT: 45,
  BACKSPACE: 8,
  F2: 113,
  F4: 115
};

function itemDetailParser($itemDetail) {
  if ($itemDetail.length === 0) return;
  let attrs = getAttrs($itemDetail);
  delete attrs['ng-focus'];
  let validators = [];
  $itemDetail.find('[ds-input]').each(function (i, item) {
    let $item = $(item),
        name = $item.attr('name'),
        customValidators = validatorParser$1($itemDetail, name),
        input_attr = getAttrs($item);
    let input_validators = getValidators(input_attr, customValidators);
    validators.push({
      name,
      validators: input_validators
    });
    let attr_validator_show = getAttrsValidatorShow(name);
    Object.keys(attr_validator_show).forEach(key => {
      $item.attr(key, attr_validator_show[key]);
    });
  });
  return {
    if: $itemDetail.attr('if'),
    template: replaceTemplate($itemDetail.html()),
    attrs,
    validators
  };
}

function validatorParser$1($itemDetail, name) {
  let validators = {};
  if ($itemDetail.find(`validators[name=${name}]`).length === 0) return;
  $itemDetail.find(`validators[name=${name}]`).find('validator').each(function (i, item) {
    Object.assign(validators, getAttrs($(item)));
  });
  return validators;
}

function dsDataTable($compile, $rootScope, $templateCache) {
  return {
    restrict: 'E',
    transclude: {
      'toolbar': '?dsDatatableToolbar',
      'body': 'dsDatatableBody',
      'footer': '?dsDatatableFooter'
    },
    scope: {
      name: '@',
      form: '=',
      items: '=',
      orderBy: '@',
      model: '=',
      removable: '=',
      addable: '=',
      selectable: '=',
      noHeader: '=',
      onCurrentChanged: '&',
      onDoubleClicked: '&',
      onItemRemoved: '&',
      onItemCreated: '&',
      onKeyPress: '&'
    },
    templateUrl: 'dsCore/datatable/dsDataTable.html',

    compile(tElement, tAttrs, transclude) {
      return function link(scope, element, attrs) {
        scope.local_removable = scope.removable === undefined ? true : scope.removable;
        scope.local_addable = scope.addable === undefined ? true : scope.addable;
        scope.local_selectable = scope.selectable === undefined ? true : scope.selectable;
        scope.local_showHeader = scope.noHeader === undefined ? true : !scope.noHeader;
        if (attrs.hasOwnProperty('bordered')) scope.bordered = true;
        const $table = $('table', element),
              $columns = $table.children('tbody').find('column'),
              $footers = $table.children('tfoot').find('footer'),
              $item_detail = $table.children('tbody').find('item-detail');
        const itemDetail = itemDetailParser($item_detail) || 'none';
        scope.columns = columnsParser($columns);
        const headerTemplate = $templateCache.get('dsCore/datatable/dataTableHeader-template.html');

        const rendered_header_template = _.template(headerTemplate)({
          columns: scope.columns
        });

        $table.children('thead').html(compile(rendered_header_template));
        const rowTemplate = $templateCache.get('dsCore/datatable/dataTableRow-template.html');

        const rendered_row_template = _.template(rowTemplate)({
          columns: scope.columns,
          itemDetail,
          removable: scope.local_removable
        });

        $table.children('tbody').html(compile(rendered_row_template));
        const footers = footerParser($footers);
        const footerTemplate = $templateCache.get('dsCore/datatable/dataTableFooter-template.html');

        const rendered_footer_template = _.template(footerTemplate)({
          columns: scope.columns,
          removable: scope.local_removable,
          footers
        });

        $table.children('tfoot').html(compile(rendered_footer_template));

        scope.removeItem = item => {
          if (scope.current === item) scope.setCurrent(null);
          scope.items.asEnumerable().remove(item);
          scope.onItemRemoved({
            $item: item
          });
        };

        scope.addItem = () => {
          let item = {};
          scope.items.push(item);
          scope.onItemCreated({
            $item: item
          });
          scope.setCurrent(item);
        };

        let buffer = [];

        scope.keyDown = $event => {
          buffer.push($event.keyCode);
        };

        scope.keyup = ($event, item) => {
          let this_buffer = buffer.asEnumerable().distinct().toArray();
          buffer = [];
          let key;
          if (this_buffer.length === 0) return;else if (this_buffer.length === 1) key = this_buffer[0];else {
            return scope.onKeyPress({
              $item: item,
              $current: scope.current,
              $field: $event.target.name,
              $key: this_buffer
            });
          }
          console.log('keyboard press : ', this_buffer.join('+'));
          if (key === keyboard.INSERT) scope.local_addable && scope.addItem();
          const name = $event.target.name || $event.target.getAttribute('name');

          if ([keyboard.ENTER, keyboard.ARROW_LEFT].includes(key)) {
            !isOpenAnyDropDown() && next($event.currentTarget.id, name, key);
          }

          if (key === keyboard.ARROW_RIGHT) {
            !isOpenAnyDropDown() && previous($event.currentTarget.id, name);
          }

          if (key === keyboard.ARROW_UP) {
            !isOpenAnyDropDown() && up($event.currentTarget.id, name);
          }

          if (key === keyboard.ARROW_DOWN) {
            !isOpenAnyDropDown() && down($event.currentTarget.id, name);
          }

          scope.onKeyPress({
            $item: item,
            $field: $event.target.name,
            $key: key
          });
        };

        function isOpenAnyDropDown() {
          return !!$('md-virtual-repeat-container').not('.ng-hide').length;
        }

        scope.setCurrent = (item, element) => {
          if (!scope.local_selectable) return;
          scope.current = item;
          scope.elementOnFocus = element;
          scope.onCurrentChanged({
            $current: item
          });
        };

        scope.onDblClicked = item => {
          scope.onDoubleClicked({
            $item: item
          });
        };

        function compile(html) {
          const linkFn = $compile(html);
          return linkFn(scope);
        }

        $rootScope.$on(`${scope.name}-focus-element`, (e, data) => {
          setFocus(data.item.id, data.element);
        });
        $rootScope.$on(`${scope.name}-keyDown`, (e, data) => {
          scope.keyDown(data.$event);
        });
        $rootScope.$on(`${scope.name}-keyUp`, (e, data) => {
          scope.keyup(data.$event);
        });

        function next(rowId, inputName, key) {
          let $tr = $(`#${rowId}`, element);
          let inputs = getInputs($tr);
          let currentIndex = inputs.indexOf(inputName);
          let nextInput = inputs[currentIndex + 1];
          if (nextInput) return setFocus(rowId, nextInput);
          if (key !== keyboard.ENTER) return;
          down(rowId, inputs[0], true);
        }

        function previous(rowId, inputName) {
          let $tr = $(`#${rowId}`, element);
          let inputs = getInputs($tr);
          let currentIndex = inputs.indexOf(inputName);
          let previousInput = inputs[currentIndex - 1];
          if (previousInput) setFocus(rowId, previousInput); //if not ...
        }

        function up(rowId, inputName) {
          let rows = getRows().filter(id => !id.includes('detail')),
              currentItemIndex = rows.indexOf(rowId);
          let upperId = rows[currentItemIndex - 1];
          if (!upperId) return;
          setFocus(upperId, inputName);
        }

        function down(rowId, inputName, canInsertIfDownNotExits) {
          let rows = getRows().filter(id => !id.includes('detail')),
              currentItemIndex = rows.indexOf(rowId);
          let lowerId = rows[currentItemIndex + 1];
          if (lowerId) return setFocus(lowerId, inputName);
          if (!canInsertIfDownNotExits) return;
          scope.addItem();
        }

        function getInputs($tr) {
          let inputs = [];
          $tr.find('.has-border-on-focus').each((i, item) => {
            inputs.push($(item).attr('name'));
          });
          return inputs;
        }

        function getRows() {
          let rows = [];
          $table.find('tbody').find('tr').each((i, item) => {
            rows.push($(item).attr('id'));
          });
          return rows;
        }

        function setFocus(rowId, element) {
          let $tr = $(`#${rowId}`, $table),
              $tr_detail = $(`#${rowId}-detail`, $table);
          let $elm = $(`[name=${element}]`, $tr);
          if ($elm.length === 0) $elm = $(`[name=${element}]`, $tr_detail);
          $elm.focus();
        }
      };
    }

  };
}

function datepicker() {
  return {
    require: 'ngModel',
    restrict: 'E',
    templateUrl: 'dsCore/controls/datepicker.html',
    scope: {
      ngModel: '=',
      ngDisabled: '=',
      label: '@'
    },
    link: (scope, element, attrs, ngModel) => {
      $(element).addClass('ds-datepicker');
      scope.localDate = null;
      scope.$watch(() => ngModel.$modelValue, newValue => {
        if (!newValue) {
          scope.localDate = null;
          return;
        }

        scope.localDate = moment(newValue, 'jYYYY/jMM/jDD')._d;
      });
      scope.$watch('localDate', newValue => {
        if (!newValue) return;
        ngModel.$setViewValue(getDate(scope.localDate));
      });

      function getDate(date) {
        if (typeof date === 'string') date = new Date(date);
        let dateToString = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        return moment(dateToString).format('jYYYY/jMM/jDD');
      }
    }
  };
}

String.prototype.replaceAll = function (token, newToken, ignoreCase) {
  var _token;

  var str = this + "";
  var i = -1;

  if (typeof token === "string") {
    if (ignoreCase) {
      _token = token.toLowerCase();

      while ((i = str.toLowerCase().indexOf(token, i >= 0 ? i + newToken.length : 0)) !== -1) {
        str = str.substring(0, i) + newToken + str.substring(i + token.length);
      }
    } else {
      return this.split(token).join(newToken);
    }
  }

  return str;
};

class Guid {
  static new() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  }

  static create() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  }

  static isEmpty(guid) {
    if (!guid) return true;
    if (guid == '') return true;
    if (guid == '00000000-0000-0000-0000-000000000000') return true;
    return false;
  }

}

function combobox(httpRequest, promise, $timeout, $window) {
  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {
      onChanged: '&onItemChanged',
      //onRemoved: '&onItemChanged',
      onBound: '&onItemBound',
      onCreate: '&onCreate',
      displayField: '@',
      valueField: '@',
      url: '<',
      option: '<',
      form: '=',
      label: '@',
      inputClass: '@',
      onInputFocus: '&',
      dataSource: '=',
      displayExpression: '@',
      filterExpression: '@',
      filterOperator: '@'
    },
    templateUrl: 'dsCore/controls/combobox.html',

    compile(tElement, tAttrs) {
      let mdAutocomplete = $('md-autocomplete', tElement),
          itemTemplate = $('md-item-template', mdAutocomplete);
      mdAutocomplete.attr('md-item-text', `item.${tAttrs.displayField}`); //mdAutocomplete.attr('md-floating-label', tAttrs.label);

      if (tAttrs.hasOwnProperty('required')) mdAutocomplete.attr('required', '');
      if (tAttrs.hasOwnProperty('ngRequired')) mdAutocomplete.attr('ng-required', tAttrs['ngRequired']);
      let inputId = Guid.new();
      mdAutocomplete.attr('md-input-id', inputId);

      if (tAttrs.hasOwnProperty('name')) {
        mdAutocomplete.attr('md-input-name', tAttrs.name);
        tElement.removeAttr('name');
      }

      if (tAttrs.hasOwnProperty('mdMenuLarge')) mdAutocomplete.attr('md-menu-container-class', 'md-menu-large');

      if (tAttrs.hasOwnProperty('placeholder')) {
        mdAutocomplete.attr('placeholder', tAttrs.placeholder);
        tElement.removeAttr('placeholder');
      }

      let msg = $('#msg', tElement);
      msg.attr('ng-messages', `form.${tAttrs.name}.$error`);
      msg.attr('ng-if', `form.${tAttrs.name}.$dirty`);
      if (!tAttrs.hasOwnProperty('label')) mdAutocomplete.removeAttr('md-floating-label');
      $('span', itemTemplate).text(`{{item.${tAttrs.displayField}}}`);
      return function link(scope, element, attrs, ngModel) {
        if (!scope.option) scope.option = {};
        let defaultFilter = scope.option && scope.option.filter && Array.isArray(scope.option.filter) ? scope.option.filter : [];
        const dataSource = scope.option.dataSource,
              oDataQuery = scope.option.oDataQuery;
        $timeout(() => {
          const $input = $(`#${inputId}`, element);
          if (attrs.inputClass) $input.addClass(attrs.inputClass);
          $input.focus(function () {
            scope.onInputFocus();

            if (scope.$root.$$phase !== '$apply' && scope.$root.$$phase !== '$digest') {
              scope.$apply();
            }
          });
          if (attrs.hasOwnProperty('blurEnter')) $window.setEnterBlur($input);
        }, 500);
        let updatedFromModel = false,
            updatedFromMe = false;
        scope.localDisabled = false;
        scope.hasCreate = attrs.hasOwnProperty('onCreate');

        scope.create = text => scope.onCreate({
          $search: text
        });
        /*scope.keyUp = function (e, text) {
            if (e.keyCode === 13 && (items && items.length > 0)) {
                scope.create(text);
            }
        };*/


        scope.searchQuery = query => {
          scope.k = search(query);
          return scope.k;
        };

        scope.selectedItemChanged = item => {
          if (updatedFromModel) {
            updatedFromModel = false;
            scope.onBound({
              $item: item
            });
            return;
          }

          if (!item) {
            ngModel.$setViewValue(null);
            updatedFromMe = true;
            scope.onChanged({
              $item: item
            });
            return;
          }

          updatedFromMe = true;
          if (attrs.hasOwnProperty('valueField')) ngModel.$setViewValue(item[attrs.valueField]);else ngModel.$setViewValue(item);
          scope.onChanged({
            $item: item
          });
        };

        scope.$watch(() => ngModel.$modelValue, newValue => {
          if (updatedFromMe) {
            updatedFromMe = false;
            return;
          }

          if (!newValue) {
            if (scope.selectedItem === null) return;
            updatedFromModel = true;
            scope.selectedItem = null;
            return;
          }

          scope.localDisabled = true;
          find(newValue).then(data => {
            updatedFromModel = true;
            scope.selectedItem = data[0];
          }).finally(() => scope.localDisabled = false);
        });

        function find(value) {
          const parameters = {
            filter: {
              logic: 'and',
              filters: [{
                field: attrs.valueField,
                operator: 'eq',
                value
              }, ...defaultFilter]
            },
            sort: [],
            take: 1,
            skip: 0
          };

          if (dataSource) {
            return promise.create(resolve => {
              dataSource.filter(`it.${attrs.valueField} == '${value}'`).toArray().then(result => {
                result.forEach(e => {
                  e[attrs.displayField] = _$1.template(attrs.displayExpression)({
                    item: e
                  });
                });
                resolve(result);
              });
            });
          } else if (oDataQuery) {
            return promise.create(resolve => {
              oDataQueryExecute(parameters).then(result => {
                if (attrs.displayExpression) result.forEach(e => {
                  e[attrs.displayField] = _$1.template(attrs.displayExpression)({
                    item: e
                  });
                });
                resolve(result);
              });
            });
          } else {
            return getData(parameters);
          }
        }

        function search(query) {
          let parameters = {
            filter: {
              logic: 'and',
              filters: [...(query ? [{
                field: attrs.displayField,
                operator: attrs.filterOperator ? attrs.filterOperator : 'contains',
                value: query
              }] : []), ...defaultFilter]
            },
            sort: [],
            take: 20,
            skip: 0
          };

          if (dataSource) {
            return promise.create(resolve => {
              dataSource.filter(_$1.template(attrs.filterExpression)({
                search: query
              })).take(20).toArray().then(result => {
                result.forEach(e => {
                  e[attrs.displayField] = _$1.template(attrs.displayExpression)({
                    item: e
                  });
                });
                resolve(result);
              });
            });
          } else if (oDataQuery) {
            if (attrs.filterExpression) parameters = {
              filter: {
                logic: 'and',
                filters: [...(query ? [{
                  operator: 'raw',
                  expression: _$1.template(attrs.filterExpression)({
                    search: query
                  })
                }] : []), ...defaultFilter]
              },
              sort: [],
              take: 20,
              skip: 0
            };
            return promise.create(resolve => {
              oDataQueryExecute(parameters).then(result => {
                if (attrs.displayExpression) result.forEach(e => {
                  e[attrs.displayField] = _$1.template(attrs.displayExpression)({
                    item: e
                  });
                });
                resolve(result);
              });
            });
          } else {
            return promise.create((resolve, reject) => {
              apiPromise.get(scope.url, parameters).then(result => {
                resolve(result.data); //items = result.data;
              }).catch(err => reject(err));
            });
          }
        }

        function getData(parameters) {
          return promise.create((resolve, reject) => {
            apiPromise.get(scope.url, parameters).then(result => {
              resolve(result.data); //items = result.data;
            }).catch(err => reject(err));
          });
        }

        function oDataQueryExecute(parameters) {
          return promise.create((resolve, reject) => {
            oDataQuery.executeAsKendo(parameters).then(result => resolve(result.data)).catch(err => reject(err));
          });
        }
      };
    }

  };
}

class HttpRequest {
  constructor($http, $q, $rootScope, $cookies, promise, translate) {
    this.$http = $http;
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$cookies = $cookies;
    this.promise = promise;
    this.translate = translate;
  }

  promisify($httpPromise) {
    return this.promise.create((resolve, reject) => {
      $httpPromise.then(data => {
        let result = data.data;
        if (result.hasOwnProperty('isValid')) return onSuccessResponseHandler(result, resolve, reject);
        resolve(result);
      }).catch(error => {
        let message = errorHandler(error);
        console.log(error);
        deferred.reject(Array.isArray(message) ? message : [message]);
      });
    });
  }

  onSuccessResponseHandler(result, resolve, reject) {
    if (result.isValid) {
      resolve(result.returnValue);
    } else {
      reject(result.errors);
    }
  }

  errorHandler(error) {
    const $rootScope = this.$rootScope,
          translate = this.translate;
    if (error.status === 401 && error.data === 'user is not authenticated') return $rootScope.$emit('onUserIsNotAuthenticated');
    const inValidMessages = ['The branch is expired', 'No token provided.', 'The branch is not active', 'The branch does not have subscription'];
    if (error.status === 403 && inValidMessages.includes(error.data)) return $rootScope.$emit('onBranchIsInvalid');
    if (error.status === 403 && error.data === 'This feature is not active' && error.config.method !== 'GET') return translate(error.data);
    if (error.status === 400) return error.data;
    if (error.status === 403 && error.data === 'User do not have permission') return translate(error.data);
    if (error.status === 500) return translate('Internal error');
  }

  getHeaders(options) {
    const $rootScope = this.$rootScope;
    let base = {
      "api-caller": "STORM-Dashboard",
      "Cache-Control": "no-cache"
    };

    if (!options) {
      let branch = $rootScope.branch;

      if (!branch) {
        $rootScope.$emit('onBranchIsInvalid');
        return;
      }

      return Object.assign({}, {
        "x-access-token": branch.token
      }, base);
    }

    if (options.userKeyAuth) {
      let userKey = $cookies.get("STORM-DASHBOARD-USER-KEY");

      if (!userKey) {
        $rootScope.$emit('onUserIsNotAuthenticated');
        throw new Error();
      }

      return Object.assign({}, {
        "authorization": userKey
      }, base);
    }

    if (options.i_sent_token_object) return options.i_sent_token_object;
  }

  get(url, data, options) {
    const $rootScope = this.$rootScope;

    if (!url) {
      return deferred;
    }

    let headers = this.getHeaders(options);
    let params;

    if ($rootScope.fiscalPeriodId && $rootScope.fiscalPeriodId.length > 1) {
      params = Object.assign({}, data, {
        fiscalPeriodId: $rootScope.fiscalPeriodId
      });
    } else {
      params = Object.assign({}, data, {});
    }

    return this.promise.create((resolve, reject) => {
      this.$http.get(url, {
        params,
        paramSerializer: '$httpParamSerializerJQLike',
        headers
      }).then(function (result) {
        resolve(result.data);
      }).catch(function (error) {
        this.errorHandler(error);
        console.log(error);
        reject(['Internal Error']);
      });
    });
  }

  post(url, data, options) {
    const $rootScope = this.$rootScope;
    let headers = this.getHeaders(options);

    if ($rootScope.fiscalPeriodId && $rootScope.fiscalPeriodId.length > 1) {
      return this.promisify($http.post(url, data, {
        headers,
        params: {
          fiscalPeriodId: $rootScope.fiscalPeriodId
        }
      }));
    } else {
      return this.promisify($http.post(url, data, {
        headers,
        params: {}
      }));
    }
  }

  put(url, data, options) {
    const $rootScope = this.$rootScope;
    let headers = this.getHeaders(options);

    if ($rootScope.fiscalPeriodId && $rootScope.fiscalPeriodId.length > 1) {
      return this.promisify($http.put(url, data, {
        headers,
        params: {
          fiscalPeriodId: $rootScope.fiscalPeriodId
        }
      }));
    } else {
      return this.promisify($http.put(url, data, {
        headers,
        params: {}
      }));
    }
  }

  delete(url, options) {
    const $rootScope = this.$rootScope;
    let headers = this.getHeaders(options);

    if ($rootScope.fiscalPeriodId && $rootScope.fiscalPeriodId.length > 1) {
      return this.promisify($http.delete(url, {
        headers,
        params: {
          fiscalPeriodId: $rootScope.fiscalPeriodId
        }
      }));
    } else {
      return this.promisify($http.delete(url, {
        headers,
        params: {}
      }));
    }
  }

}

class Promise {
  constructor($q) {
    this.$q = $q;
  }

  create(handler) {
    let deferred = this.$q.defer();
    handler(deferred.resolve, deferred.reject);
    return deferred.promise;
  }

  all(promises) {
    let deferred = this.$q.defer();
    this.$q.all(promises).then(result => deferred.resolve(result)).catch(err => deferred.reject(err));
    return deferred.promise;
  }

}

function Translate($filter) {
  return key => $filter('translate')(key);
}

Array.prototype.asEnumerable = function () {
  let enumerable = Enumerable__default['default'].from(this);
  enumerable.remove = remove.bind(this);
  enumerable.removeAll = removeAll.bind(this);
  return enumerable;
};

function remove(item) {
  var i = this.indexOf(item);
  this.splice(i, 1);
}

function removeAll() {
  var self = this;

  while (self.length != 0) {
    self.shift();
  }

  return this;
}

class ODataQueryBuilder {
  constructor(promise, request, Environment) {
    this.promise = promise;
    this.request = request;
    this.Environment = Environment;
    this.rootUrl = Environment.ROOT_URL;
    this.endpoint = '';
    this.initConfig();
  }

  clone() {
    const instance = new ODataQueryBuilder(this.promise, this.request, this.Environment);
    instance.initConfig();
    instance.config.id = this.config.id;
    instance.endpoint = this.endpoint;
    instance.config.where = this.config.where.map(e => typeof e === "string" ? e : Object.assign({}, e));
    instance.config.orderBy = this.config.orderBy.map(e => typeof e === "string" ? e : Object.assign({}, e));
    instance.config.include = this.config.include.map(e => typeof e === "string" ? e : Object.assign({}, e));
    instance.config.take = this.config.take;
    instance.config.skip = this.config.skip;
    instance.config.queryString = this.config.queryString;
    return instance;
  }

  initConfig() {
    this.config = {
      id: null,
      single: false,
      where: [],
      orderBy: [],
      include: [],
      take: 20,
      skip: 0,
      queryString: null,
      inlineCount: false,
      paging: true
    };
  }

  from(endpoint) {
    this.endpoint = endpoint;
    return this;
  }

  find(id) {
    const instance = this.clone();
    instance.config.id = id;
    return instance.execute();
  }

  single() {
    const instance = this.clone();
    instance.config.single = true;
    return instance.execute();
  }

  firstOrDefault(field, operator, value, defaultValue = null) {
    let instance = this.clone();
    if (field) instance = instance.where(field, operator, value);
    instance = instance.take(1);
    return this.promise.create((resolve, reject) => {
      instance.execute().then(result => {
        const value = result.value;
        if (value.length > 0) resolve(value[0]);else resolve(defaultValue);
      }).catch(e => reject(e));
    });
  }

  include(association) {
    let instance = this.clone();
    instance.config.include.push(association);
    return instance;
  }

  where(field, operator, value) {
    let instance = this.clone();
    instance.config.where.push({
      field,
      operator,
      value
    });
    return instance;
  }

  whereRaw(whereClause) {
    let instance = this.clone();
    instance.config.where.push(whereClause);
    return instance;
  }

  orderBy(field) {
    let instance = this.clone();
    instance.config.orderBy.push({
      field,
      dir: 'asc'
    });
    return instance;
  }

  orderByDescending(field) {
    let instance = this.clone();
    instance.config.orderBy.push({
      field,
      dir: 'desc'
    });
    return instance;
  }

  take(num) {
    let instance = this.clone();
    instance.config.take = num;
    return instance;
  }

  skip(num) {
    let instance = this.clone();
    instance.config.skip = num;
    return instance;
  }

  useInlineCount() {
    let instance = this.clone();
    instance.config.inlineCount = true;
    return instance;
  }

  _getHeader(header) {
    const base = {
      "api-caller": "STORM-Dashboard",
      "Cache-Control": "no-cache"
    };
    return Object.assign({}, base, header);
  }

  _parseCollectionParams() {
    const config = this.config;
    let query = {};

    if (config.paging === true) {
      if (config.take) query.$top = config.take;
      if (config.skip) query.$skip = config.skip;
    }

    if (config.inlineCount) query.$count = true;
    if (config.orderBy.length > 0) query.$orderby = config.orderBy.map(e => `${e.field} ${e.dir}`).join(',');

    function mapValue(value) {
      if (typeof value === 'string') return `'${value}'`;
      return value;
    }

    if (config.where.length > 0) query.$filter = config.where.map(e => typeof e === 'string' ? e : `${e.field} ${e.operator} ${mapValue(e.value)}`).join(' and ');
    return query;
  }

  _parseInclude() {
    const config = this.config;
    if (config.include.length > 0) return {
      $expand: config.include.join(',')
    };
  }

  _parseKendoParameters(parameters) {
    const instance = this.clone();
    const where = [],
          orderBy = [];
    const filters = (parameters.filter || {
      filters: []
    }).filters,
          sort = parameters.sort || [];
    const operatorsMapping = {
      eq: 'eq',
      gt: 'gt',
      gte: 'ge',
      lt: 'lt',
      lte: 'le'
    };
    filters.forEach(filter => {
      if (['eq', 'gt', 'gte', 'lt', 'lte'].includes(filter.operator)) where.push({
        field: filter.field,
        operator: operatorsMapping[filter.operator],
        value: filter.value
      });
      if (filter.operator === 'contains') where.push(`contains(${filter.field}, '${filter.value}')`);
      if (filter.operator === 'startswith') where.push(`startswith(${filter.field}, '${filter.value}')`);
      if (filter.operator === 'endswith') where.push(`endswith(${filter.field}, '${filter.value}')`);
      if (filter.operator === 'isNull') where.push(`${filter.field} eq null`);
      if (filter.operator === 'isNotNull') where.push(`not(${filter.field} eq null)`);
      if (filter.operator === 'isTrue') where.push(`${filter.field} eq true`);
      if (filter.operator === 'isFalse') where.push(`${filter.field} eq false`);

      if (filter.operator === 'in') {
        const values = filter.value.map(e => typeof e === 'string' ? `'${e}'` : e).join(',');
        where.push(`${filter.field} in (${values})`);
      }

      if (filter.operator === 'notIn') {
        const values = filter.value.map(e => typeof e === 'string' ? `'${e}'` : e).join(',');
        where.push(`not(${filter.field} in (${values}))`);
      }

      if (filter.operator === 'raw') {
        where.push(filter.expression);
      }

      if (filter.operator === 'between') {
        let one = filter.value[0],
            two = filter.value[1];
        one = typeof one === 'string' ? `'${one}'` : one;
        two = typeof two === 'string' ? `'${two}'` : two;
        where.push(`${filter.field} ge ${one} and ${filter.field} le ${two}`);
      }
    });
    sort.forEach(e => {
      const item = this.config.orderBy.asEnumerable().firstOrDefault(o => o.field === e.field);

      if (item) {
        item.dir = e.dir;
        return;
      }

      if (e.dir === 'asc') orderBy.push({
        field: e.field,
        dir: 'asc'
      });
      if (e.dir === 'desc') orderBy.push({
        field: e.field,
        dir: 'desc'
      });
    });
    if (parameters.paging === false) instance.config.paging = false;else {
      if (parameters.take) instance.config.take = parameters.take;
      if (parameters.skip) instance.config.skip = parameters.skip;
    }
    instance.config.inlineCount = true;
    instance.config.where = [...instance.config.where, ...where];
    instance.config.orderBy = [...instance.config.orderBy, ...orderBy];
    return instance;
  }

  setQueryString(queryString) {
    const instance = this.clone();
    instance.config.queryString = queryString;
    return instance;
  }

  executeAsKendo(parameters) {
    const instance = this.clone();
    return this.promise.create((resolve, reject) => {
      instance._parseKendoParameters(parameters).execute().then(result => {
        if (parameters.paging === false) resolve(result.value);else resolve({
          data: result.value,
          total: result["@odata.count"]
        });
      }).catch(error => {
        reject(error);
        console.log(error);
      });
    });
  }

  execute() {
    let url = `${this.rootUrl}/${this.endpoint}`;

    let params = this._parseInclude();

    if (this.config.id) url = `${url}('${this.config.id}')`;
    if (!this.config.id && !this.config.single) params = Object.assign({}, params, this._parseCollectionParams());
    if (this.config.queryString) params = Object.assign({}, params, this.config.queryString);
    return this.request.get(url, params);
  }

}

class DataService {
  constructor(promise, httpRequest, Environment) {
    this.promise = promise;
    this.httpRequest = httpRequest;
    this.Environment = Environment;
  }

  from(collection) {
    const queryBuilder = new ODataQueryBuilder(this.promise, this.httpRequest, this.Environment);
    queryBuilder.from(collection);
    return queryBuilder;
  }

}

___default['default'].templateSettings.interpolate = /#([\s\S]+?)#/g;
angular__default['default'].module('ds-core', ['ngMaterial', 'angular-material-persian-datepicker', 'ngCookies']).directive('dsDatatable', dsDataTable).directive('dsDatepicker', datepicker).directive('dsCombobox', combobox).filter('translate', function () {
  return input => {
    return input;
  };
}).service('httpRequest', HttpRequest).service('promise', Promise).service('dataService', DataService).factory('translate', Translate);
