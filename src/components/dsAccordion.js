import dsAccordionTemplate from './dsAccordion.html';

class dsAccordionController {

}

/**
 * @ngdoc component
 * @name CoreModule.component:dsAccordion
 * @param {String} groupClass
 */
export const dsAccordionComponent = {
    controller: dsAccordionController,
    controllerAs: '$dsAccordion',
    template: '<uib-accordion><div ng-transclude></div></uib-accordion>',
    transclude: true,
    bindings: {
        groupClass: '@'
    }
}

class dsAccordionGroupController {
    /* @ngInject */
    constructor($scope, $attrs) {
        this.$scope = $scope;
        this.$attrs = $attrs;
        this.isOpen = null;
        this.dsAccordionCtrl = null;
        this.showHandle = null;
        this._showHandle = true;
        this.canInit = !$attrs.hasOwnProperty('initOnClick');
    }

    $onInit() {
        this.$scope.$watch(
            _ => this.isOpen,
            newVal => {
                if (newVal)
                    this.canInit = true;
            });

        if(this.$attrs.hasOwnProperty('showHandle'))
            this._showHandle = this.showHandle;
    }
}
/**
 * @ngdoc component
 * @name CoreModule.component:dsAccordionGroup
 * @param {Boolean} isOpen
 * @param {String} heading
 * @param {Boolean} initOnClick
 */
export const dsAccordionGroupComponent = {
    require: {
        dsAccordionCtrl: '^dsAccordion'
    },
    template: dsAccordionTemplate,
    controller: dsAccordionGroupController,
    controllerAs: '$dsAccordionGroup',
    transclude: {
        'heading': '?dsAccordionGroupHeading',
        'body': '?dsAccordionGroupBody'
    },
    bindings: {
        isOpen: '=',
        showHandle: '<',
        heading: '@',
        initOnClick: '<'
    }
}
