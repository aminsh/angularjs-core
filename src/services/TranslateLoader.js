import { dictionary } from "./translateDictionary";

/* @ngInject */
export function TranslateLoader(promise) {
    return options => {
        return promise.create(resolve => {
            const defaultDictionary = dictionary[options.key];
            const paramsDictionary = options[options.key];
            resolve(Object.assign({}, defaultDictionary, paramsDictionary));
        });
    }
}
