import { IClassType } from './types';

export interface Array<T> {
    remove(item: T);

    toArray(): Array<T>
}

export enum keyboard {
    ENTER = 13,
    SHIFT = 16,
    ARROW_RIGHT = 39,
    ARROW_LEFT = 37,
    ARROW_UP = 38,
    ARROW_DOWN = 40,
    DELETE = 46,
    INSERT = 45,
    BACKSPACE = 8,
    F2 = 113,
    F4 = 115
}

export declare class Guid {
    static new(): string;

    static create(): string;

    static isEmpty(guid: string): boolean;
}

export declare class ClassTransformer {
    static map<T>(ctor: IClassType<T>, data: T): T;

    static clone<T>(data: T): T;
}

export declare function camelToKebab(str): string;

export declare function kebabToCamel(input): string;

export declare function digitToWord(number: Number): string;

export declare function dateToWord(date: string): string;

export declare class PersianDate {
    static current(): string;

    static getDate(date: Date): string;

    static toWord(date: string): string;
}
