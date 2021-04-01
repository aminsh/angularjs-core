import { DsLoadingController } from "./dsLoading";
import { dsTranslateLoader } from "./dsTranslateLoader";
import { DsHttpRequest } from "./dsHttpRequest";
import { DsPromise } from "./dsPromise";
import { dsTranslate } from "./dsTranslate";
import { DsDataService } from "./dsDataService";
import { DsDialogService } from "./dsDialog";
import { DsLogger } from "./dsLogger";
import { DsFormService } from "./dsFormService";
import { dsConfirm } from "./dsConfirm";
import loadingTemplate from './dsLoading.html';


export { DsDialog, registerDialog, DialogProvider } from './dsDialog';

export class Index {
    static configure(module) {
        module
            .service('dsHttpRequest', DsHttpRequest)
            .service('dsPromise', DsPromise)
            .service('dsDataService', DsDataService)
            .service('dsDialog', DsDialogService)
            .service('dsLogger', DsLogger)
            .service('dsFormService', DsFormService)

            .factory('dsLoading', /*@ngInject*/ (dsDialog) => {
                return dsDialog.createForService({
                    controller: DsLoadingController,
                    controllerAs: '$ctrl',
                    template: loadingTemplate
                });
            })
            .factory('dsTranslateLoader', dsTranslateLoader)
            .factory('dsTranslate', dsTranslate)
            .factory('dsConfirm', dsConfirm)
    }
}
