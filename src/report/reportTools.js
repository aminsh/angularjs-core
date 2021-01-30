export function defaultViewerConfig() {
    let config = new Stimulsoft.Viewer.StiViewerOptions();
    config.toolbar.fontFamily = "IRANSans";
    config.toolbar.showDesignButton = false;
    config.toolbar.printDestination = Stimulsoft.Viewer.StiPrintDestination.Direct;
    config.appearance.htmlRenderMode = Stimulsoft.Report.Export.StiHtmlExportMode.Table;
    return config;
}

export function addVariable(options) {
    let variable = new Stimulsoft.Report.Dictionary.StiVariable();

    variable.name = options.name;
    variable.alias = options.alias;
    variable.category = options.category;
    variable.value = options.value;

    return variable;
}
