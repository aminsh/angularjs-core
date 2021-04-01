import { dsEnvironmentProvider } from "./dsEnvironmentProvider";

export class Index {
    static configure(module) {
        module.provider('dsEnvironment', dsEnvironmentProvider)
    }
}
