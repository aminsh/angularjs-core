import { mdConfig } from "./mdConfig";

export class Index {
    static configure(module) {
        module.config(mdConfig);
    }
}
