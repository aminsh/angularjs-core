export class Translate {
    constructor($filter){
        this.$filter=$filter;
    }
    translate(key){
        this.$filter('translate')(key);
    }
}
