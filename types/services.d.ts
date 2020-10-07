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

export declare function Translate(key: string): string;

export declare function IConfirmDialog(title:string , message:string): Promise<boolean>;

export interface Logger {
    alert(message : string) : void;
    success(message : string) : void;
    info(message : string) : void;
    close() : void;
    warning(message : string) : void;
    error(message : string) : void;
}

export declare function Navigate(name: string,parameter: object,queryString:string):void;

export interface IFormService {
    setDirty(form : any) : void;
    setClean(form : any) : void;
    setDirtySubForm(form : any) : void;
}