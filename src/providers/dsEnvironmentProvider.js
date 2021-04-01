export function dsEnvironmentProvider() {
    let environmentVariables;
    return {
        set: variables => environmentVariables = variables,
        $get: () => environmentVariables
    };
}
