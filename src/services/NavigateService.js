export function NavigateService($state, $location) {
    let navigate = (name, parameters, queryString) => {

        if (queryString)
            $location.search(queryString);
        else $location.search({});

        $state.go(name, parameters)
    };

    return navigate;
}




