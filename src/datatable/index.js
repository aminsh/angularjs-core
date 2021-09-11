import { dsDataTable } from "./dsDataTable";
import { DsGridColumnChooser } from "./dsGridColumnChooser";
import gridColumnChooserTemplate from './dsGridColumnChooser.html';
import { DsEntitySetFactory } from "./dsEntitySetFactory";
import { dsEntityConfigurationProvider } from "./dsEntityConfigurationProvider";

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
            })
            .service('dsEntitySetFactory', DsEntitySetFactory)
            .provider('dsEntityConfiguration', dsEntityConfigurationProvider)
    }
}
