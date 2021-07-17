import moment from 'moment-jalaali';
import { dateToWord } from "./date";

export class PersianDate {
    static current() {
        return moment().format('jYYYY/jMM/jDD');
    }

    static getDate(date) {
        let dateToString = `${ date.getFullYear() }/${ date.getMonth() + 1 }/${ date.getDate() }`;
        return moment(dateToString).format('jYYYY/jM/jD');
    }

    static toWord(date) {
        return dateToWord(date);
    }
}
