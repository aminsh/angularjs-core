export interface IReportDialogParameters {
    title?: string;
    data: any,
    fileName: string,
    variables?: IReportVariable[]
}

export interface IReportVariable {
    name: string;
    alias: string;
    category: string;
    value: any
}

export interface IReportDialog {
    show(params: IReportDialogParameters): void;
}

export interface IReportConfigProvider {
    addVariable(params: IReportVariable): void;

    setViewerConfig(exp: (cfg: any) => void): void;

    setBaseURL(URL: string);
}
