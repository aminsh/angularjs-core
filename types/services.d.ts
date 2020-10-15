export interface Constructor {
    new(...args: any[]);
}

export interface IDataService {
    from<TResponse>(collection: string): IODataQueryBuilder<TResponse>;
}

export interface IODataQueryBuilder<TResponse> {
    find(id: string): Promise<TResponse>;

    single(): Promise<TResponse>;

    firstOrDefault(field: string, operator: string, value: any, defaultValue?: any): Promise<TResponse>;

    include(association): IODataQueryBuilder<TResponse>;

    where(field: string, operator: string, value: any): IODataQueryBuilder<TResponse>;

    whereRaw(whereClause: string): IODataQueryBuilder<TResponse>;

    orderBy(field: string): IODataQueryBuilder<TResponse>;

    orderByDescending(field: string): IODataQueryBuilder<TResponse>;

    take(number: number): IODataQueryBuilder<TResponse>;

    skip(number: number): IODataQueryBuilder<TResponse>;

    useInlineCount(): IODataQueryBuilder<TResponse>;

    setQueryString(qs: string): IODataQueryBuilder<TResponse>;

    executeAsKendo(parameters: any): Promise<IKendoResponse<TResponse>>;

    execute(): Promise<IODataResponse<TResponse>>
}

export interface IODataResponse<TResponse> {
    value: TResponse[];
    ['@odata.count']: number
}

export interface IKendoResponse<TResponse> {
    data: TResponse[];
    total: number
}

export interface IHttpRequest {
    get<TResponse>(url: string, data: any, options?: any): Promise<TResponse>;

    post<TResponse>(url: string, data: any, options?: any): Promise<TResponse>;

    put<TResponse>(url: string, data: any, options?: any): Promise<TResponse>;

    delete<TResponse>(url: string, options?: any): Promise<TResponse>;
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

export declare function IConfirmDialog(title: string, message: string): Promise<boolean>;

export interface Logger {
    alert(message: string): void;

    success(message: string): void;

    info(message: string): void;

    close(): void;

    warning(message: string): void;

    error(message: string): void;
}

export declare function Navigate(name: string, parameter: object, queryString: string): void;

export interface IFormService {
    setDirty(form: any): void;

    setClean(form: any): void;

    setDirtySubForm(form: any): void;
}