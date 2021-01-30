export interface IDictionary<TValue> {
    [key: string]: TValue;
}

export interface IClassType<T> {
    new(...args: any[]): T;
}
