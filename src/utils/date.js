import { digitToWord } from "./string";

export function dateToWord(date){
    const months = {
            1: "فروردین",
            2: "اردیبهشت",
            3: "خرداد",
            4: "تیر",
            5: "مرداد",
            6: "شهریور",
            7: "مهر",
            8: "آبان",
            9: "آذر",
            10: "دی",
            11: "بهمن",
            12: "اسفند"
        },
        fn = digitToWord,
        dateSplit = date.split('/'),
        year = parseInt(dateSplit[0]),
        month = parseInt(dateSplit[1]),
        day = parseInt(dateSplit[2]);

    return '{0} {1} ماه {2}'.format(fn(day) + 'م', months[month], fn(year));
}
