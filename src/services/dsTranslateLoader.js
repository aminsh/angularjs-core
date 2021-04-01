import { dsTranslateDefaultDictionary } from "./dsTranslateDefaultDictionary";

/* @ngInject */
export function dsTranslateLoader(dsPromise) {
    return options => {
        return dsPromise.create(resolve => {
            const defaultDictionary = dsTranslateDefaultDictionary[options.key];
            const paramsDictionary = options[options.key];
            resolve(Object.assign({}, defaultDictionary, paramsDictionary));
        });
    }
}
