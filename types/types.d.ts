export interface IDictionary<TValue> {
    [key: string]: TValue;
}

export interface IClassType<T> {
    new(...args: any[]): T;
}

export type Nullable<T> =  {
    [P in keyof T]?: T[P]
}

