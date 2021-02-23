import { Guid } from "./string";

export const ItemState = {
    added: 'added',
    modified: 'modified',
    removed: 'removed'
};

export class Collection {
    static from(data) {
        const instance = new Collection();
        instance._data = data;
        instance._setOriginals();
        return instance;
    }

    constructor() {
        this.changeSet = [];
    }

    enableChangeTracking() {
        this.changeTrackingEnabled = true;

        this._data.forEach(item => {
            this.subscribe(item);
        })
    }

    subscribe(item) {
        item.subscribe((prop, newValue) => {
            const itemFromChangeSet = this.changeSet.asEnumerable().firstOrDefault(e => e.data === item);
            if (itemFromChangeSet) {
                if (itemFromChangeSet.state === ItemState.modified)
                    itemFromChangeSet.changes[prop] = newValue;
            } else {
                const changes = {};
                changes[prop] = newValue;
                this.changeSet.push({ state: ItemState.modified, changes, data: item });
            }
        });
    }

    commit() {
        this.changeSet = [];
        this._setOriginals();
    }

    push(item) {
        if (this.changeTrackingEnabled) {
            this.subscribe(item);
            this.changeSet.push({ state: ItemState.added, data: item });
        }

        this._data.push(item);
    }

    remove(item) {
        this._data.remove(item);

        if (!this.changeTrackingEnabled)
            return;

        const itemFromChangeSet = this.changeSet.asEnumerable().firstOrDefault(e => e.data === item);

        if (!itemFromChangeSet)
            return this.changeSet.push({ state: ItemState.removed, data: item });

        if (itemFromChangeSet.state === ItemState.added)
            return this.changeSet.remove(itemFromChangeSet);

        else if (itemFromChangeSet.state === ItemState.modified)
            return itemFromChangeSet.state = ItemState.removed;
    }

    toArray() {
        return this._data;
    }

    getState(item) {
        const itemFromChangeSet = this.changeSet.asEnumerable().firstOrDefault(e => e.data === item);
        if (!itemFromChangeSet)
            return;
        return itemFromChangeSet.state;
    }

    setState(item, state) {
        const itemFromChangeSet = this.changeSet.asEnumerable().firstOrDefault(e => e.data === item);
        if (itemFromChangeSet)
            return;
        this.changeSet.push({ state, data: item });
    }

    getOriginals() {
        return this._originals;
    }

    _setOriginals() {
        this._originals = JSON.parse(JSON.stringify(this._data));
    }
}

export function Observable() {
    return function (target) {
        target.prototype.subscribe = function (subscriber) {
            this._subscribers = this._subscribers || [];
            const key = Guid.create();
            this._subscribers.push({ key, subscriber });
            return key;
        };
        target.prototype.unsubscribe = function (key) {
            const subscriber = this._subscribers.asEnumerable().firstOrDefault(e => e.key === key);
            this._subscribers.remove(subscriber);
        };
        target.prototype._onChange = function (prop, newValue) {
            this._subscribers = this._subscribers || [];
            this._subscribers.forEach(sub => sub.subscriber(prop, newValue));
        }
        target.prototype.toJSON = function () {
            const metadataKeys = Reflect.getMetadataKeys(target);
            const keys = metadataKeys.filter(key => key.startsWith('stormCore.property.'))
                .map(key => Reflect.getMetadata(key, target))
                .map(opt => opt.propertyName);
            const result = {};
            keys.forEach(key => result[key] = this[key]);
            return result;
        }
        return target;
    };
}

export function Property() {
    return function (target, key) {
        Reflect.defineMetadata(`stormCore.property.${ key }:options`, { propertyName: key }, target.constructor);

        let localFieldName = `_${ key }`;

        const getter = function () {
            return this[localFieldName];
        };
        const setter = function (value) {
            this[localFieldName] = value;
            this._onChange(key, value);
        };

        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true,
        });
    };
}
