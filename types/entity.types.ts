export interface Trackable {
    trackingState: TrackingState
}

export type EntityConfigurationProperty = {
    [P in keyof any]: EntityPropertyMetadata
}

export interface EntityPropertyMetadata {
    type?: string;
    track: boolean;
}

export enum TrackingState {
    Unchanged = 'Unchanged',
    Added = 'Added',
    Modified = 'Modified',
    Deleted = 'Deleted'
}

export interface EntityConfigurationProvider {
    define: (entityName: string, schema: { properties: EntityConfigurationProperty }) => void;
}

export declare class EntitySet<T extends Trackable> {
    changeSet: Array<T>;
    originals: Array<T>;

    attachMany(items: T[]): void;

    add(item: T): void;

    change(item: T): void;

    remove(item: T): void;
}

export interface EntitySetFactory {
    create<T extends Trackable>(entityName: string, store: any): EntitySet<T>;
}

export interface TrackableDataTable<T extends Trackable> {
    setFocus(item: T, element: string);

    setItems(items: T[]): void;

    addItem(items: T): void;

    setCurrent(item: T): void;

    entitySet: EntitySet<T>;

    commit: () => void;
}
