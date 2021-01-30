import { Loading } from "./Loading";

export * from './HttpRequest';
export * from './Promise';
export * from './Translate';
export * from './DataService';
export * from './Dialog';
export * from './NavigateService';
export * from './Logger';
export * from './FormService';
export * from './Confirm';

export class ServicesConfiguration {
    static configure(module) {
        module
            .controller('dsLoadingController', Loading)
            .factory('dsLoading', /*@ngInject*/ (dsDialog) => {
                return dsDialog.createForService({
                    controller: 'dsLoadingController',
                    controllerAs: '$ctrl',
                    templateUrl: 'dsCore/services/Loading.html'
                });
            })
    }
}
