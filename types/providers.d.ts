export interface IEnvironmentProvider {
    set: (variables: IEnvironment) => void
}

export interface IEnvironment {
    ROOT_URL: string;
    UPLOAD_URL: string;
    TENANT_KEY: string;
    USER_KEY: string;
}


