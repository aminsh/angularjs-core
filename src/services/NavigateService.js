export class NavigateService {
    constructor($state, $location){
        this.$state = $state;
        this.$location = $location;
    }
    navigate(name, parameters, queryString) {

        if (queryString)
            this.$location.search(queryString);
        else this.$location.search({});

        this.$state.go(name, parameters)
    };
}




