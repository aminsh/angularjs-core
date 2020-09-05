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
