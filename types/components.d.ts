export interface IPagingOptions {
    pagingEnabled?: boolean;
    pageSize?: number;
    reset?: () => void;
    refresh?: () => void;
}

export interface IPage {
    page?: number;
    skip?: number;
    take?: number
}

export interface ISideMenuItem {
    label?: string;
    state?: string;
    mdIcon?: string;
    underDevelop?: boolean;
    children?: Array<ISideMenuItem>
}

export interface IPdfViewerParameters {
    url: string;
}

export class IPdfViewerDialog {
    show(parameters: IPdfViewerParameters): void;
}

export class IDataTable<T> {
    setFocus(item: T, element: string);
}

export interface IPageable<T> {
    data: T[];
    total: number;
}

export interface IDataSource<T> {
    find(parameters: any): Promise<IPageable<T>>;
    findOne(parameters: any): Promise<T>
}
