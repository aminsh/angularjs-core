import { Constructor, IDialogOptions } from './services';

export interface ICollection<TCollection> {
    toArray(): TCollection[];

    forEach(action: (item: TCollection, index: number) => void);

    push(item: TCollection): void;

    remove(item: TCollection): void;

    getState(item: TCollection): ItemState;

    setState(item: TCollection, state: ItemState);

    enableChangeTracking(): void;

    commit(): void;

    changeTrackingEnabled: boolean;

    changeSet: IChangeSet<TCollection>[];

    getOriginals(): Array<TCollection>;
}

export class Collection {
    static from<TCollection>(data: TCollection[]);
}

export declare enum ItemState {
    added = 'added',
    modified = 'modified',
    removed = 'removed'
}

export interface IChangeSet<T> {
    state: ItemState;
    data: T;
}

export declare function Observable(): (target: Constructor) => void;

export declare function Property(): (target: any, key: string) => void;
