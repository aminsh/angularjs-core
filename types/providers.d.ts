export interface IEnvironmentProvider {
    set: (variables: IEnvironment) => void
}

export interface IEnvironment {
    ENV?: string;
    ROOT_URL?: string;
    LOGIN_URL?: string;
    UPLOAD_URL?: string;
    TENANT_KEY?: string;
    USER_KEY?: string;
    FISCAL_PERIOD?: string;
}


