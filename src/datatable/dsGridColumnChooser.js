export class DsGridColumnChooser {
    /*@ngInject*/
    constructor($rootScope, data) {
        this.$rootScope = $rootScope;
        this.columns = data.columns.map(e => Object.assign(e, {
            hasTitle: !!e.title,
            titleIsExpression: (!!e.title) && e.title.includes('{{')
        }));
        this.gridId = data.gridId;
    }

    onSelectionChanged() {
        this.$rootScope.$emit(`gird:${ this.gridId }:columnChooseChanged`, this.columns);
    }
}
