import { DsEntitySet } from "./dsEntitySet";

export class DsEntitySetFactory {
    /* @ngInject */
    constructor(dsEntityConfiguration) {
        this.store = dsEntityConfiguration;
    }

    create(entityName) {
        return new DsEntitySet(entityName, this.store);
    }
}
