export interface IDataService {
    from<TResponse>(collection: string): any;
}

export interface IHttpRequest {
    get<TResponse>(url: string, data: any, options: any): Promise<TResponse>;
    post<TResponse>(url: string, data: any, options: any): Promise<TResponse>;
    put<TResponse>(url: string, data: any, options: any): Promise<TResponse>;
    delete<TResponse>(url: string, options: any): Promise<TResponse>;
}