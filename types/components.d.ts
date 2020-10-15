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
