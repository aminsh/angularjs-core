export function environmentProvider() {
    let environmentVariables;
    return {
        set: variables => environmentVariables = variables,
        $get: () => environmentVariables
    };
}
