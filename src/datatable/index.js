import { dsDataTable } from "./dsDataTable";
import { DsGridColumnChooser } from "./dsGridColumnChooser";
import gridColumnChooserTemplate from './dsGridColumnChooser.html';

export class Index {
    static configure(module) {
        module
            .directive('dsDatatable', dsDataTable)
            .factory('dsGridColumnChooser', /*@ngInject*/ (dsDialog) => {
                return dsDialog.createForService({
                    controller: DsGridColumnChooser,
                    controllerAs: '$ctrl',
                    template: gridColumnChooserTemplate
                });
            });
    }
}
