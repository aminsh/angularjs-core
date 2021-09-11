export class DsEntitySet {
    constructor(entityName, store) {
        this.store = store;
        this.entityName = entityName;
        this.changeSet = [];
        this.originals = [];
    }

    _attach(item, isNew = false) {
        const data = this.store.add(this.entityName, item);

        if (!isNew) {
            data.on('change', (record, changes) => {
                this.change(record);
            });
        }

        const instance = data;
        instance.trackingState = TrackingState.Unchanged;
        return instance;
    }

    attach(items) {
        this.originals = items;
        return items.map(item => this._attach(item));
    }

    add(item) {
        const instance = this._attach(item, true);
        instance.trackingState = TrackingState.Added;
        this.changeSet.push(instance);
        return instance;
    }

    change(item) {
        if (this.changeSet.asEnumerable().any(e => e === item))
            return;

        item.trackingState = TrackingState.Modified;
        this.changeSet.push(item);
    }

    remove(item) {
        const entity = this.changeSet.asEnumerable().firstOrDefault(e => e === item);

        if (entity) {
            if (entity.trackingState === TrackingState.Added)
                this.changeSet.remove(entity);
            if (entity.trackingState === TrackingState.Modified)
                entity.trackingState = TrackingState.Deleted;
        } else {
            item.trackingState = TrackingState.Deleted;
            this.changeSet.push(item);
        }
    }
}

const TrackingState = {
    Unchanged: 'Unchanged',
    Added: 'Added',
    Modified: 'Modified',
    Deleted: 'Deleted'
}
