export interface Constructor {
    new(...args: any[]);
}


export interface IDataService {
    from<TResponse>(collection: string): any;
}

export interface IHttpRequest {
    get<TResponse>(url: string, data: any, options: any): Promise<TResponse>;

    post<TResponse>(url: string, data: any, options: any): Promise<TResponse>;

    put<TResponse>(url: string, data: any, options: any): Promise<TResponse>;

    delete<TResponse>(url: string, options: any): Promise<TResponse>;
}

/**
 * @description This is Decorator for dialog controller
 * */
export declare function DsDialog(options: IDialogOptions): (ctrl: Constructor) => void;

export declare function registerDialog(ctrl: Constructor): { provide: string, useFactory: Function, deps?: any[] }

export interface IDialogService {
    createForRoute(options: IRouteDialogOptions): void

    hide(parameters: any): void;

    cancel(): void;
}

export interface IShowDialog<TRequest, TResponse> {
    show(parameters: TRequest): Promise<TResponse>;
}

export interface IDialogOptions {
    provide?: string;
    controllerAs?: string;
    template: string;
}

export interface IRouteDialogOptions {
    controller: string | Constructor;
    controllerAs?: string;
    template: string;
    resolve?: object;
    locals?: object;
}

export declare enum DialogProvider {
    fromService = 'fromService',
    fromRoute = 'fromRoute'
}

export type Translate = (key: string) => string

export type IConfirmDialog = (params: IConfirmOption) => Promise<boolean>

export interface IConfirmOption {
    title?: string,
    message?: string
}

export interface Logger {
    alert(message: string): void;

    success(message?: string): void;

    info(message: string): void;

    close(): void;

    warning(message: string): void;

    error(message: string): void;
}

export type Navigate = (params: INavigateParam) => void;

export interface INavigateParam {
    name?: string,
    parameter?: object,
    queryString?: string
}

export interface IFormService {
    setDirty(form: any): void;

    setClean(form: any): void;

    setDirtySubForm(form: any): void;
}