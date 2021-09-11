import { DataStore } from "js-data";

export function dsEntityConfigurationProvider() {
    const store = new DataStore();

    this.$get = function () {
        return store;
    }

    this.define = function (entityName, schema) {
        store.defineMapper(entityName, {
            endpoint: entityName,
            schema
        });
    }
}

