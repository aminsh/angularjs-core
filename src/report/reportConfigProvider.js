export function reportConfigProvider() {
    let variables = [];
    let viewerConfig = null;
    let baseURL = null;

    return {
        addVariable: variable => variables.push(variable),
        setViewerConfig: configFunc => viewerConfig = configFunc,
        setBaseURL: URL =>  baseURL = URL,
        $get: () => ({
            variables,
            viewerConfig,
            baseURL
        })
    }
}
